<img width="645" height="430" alt="file" src="https://github.com/user-attachments/assets/8e9147b8-8588-4125-9095-5460ad7a7185" />

# Gestion École

Application web de gestion d’établissement scolaire. Le projet comprend un
site public, des espaces de connexion par rôle et une API REST qui centralise
les données scolaires.



## Fonctionnalités

- **Site public :** accueil, présentation de l’établissement, programmes,
  actualités, statistiques, témoignages et inscription/admission.
- **Espace administration :** tableau de bord, élèves, enseignants, classes,
  matières, notes, présences, emploi du temps, actualités, admissions,
  messages reçus et paramètres.
- **Espace enseignant :** tableau de bord dédié.
- **Espace élève :** tableau de bord dédié.
- **Comptes et accès :** connexion, inscription, profil et autorisation par
  rôle (`ADMIN`, `ENSEIGNANT`, `ELEVE`, `PARENT`) avec jetons JWT.
- **API :** gestion des données scolaires et statistiques publiques.

## Technologies

- **Frontend :** React 19, TypeScript, Vite, React Router, Axios, Tailwind CSS.
- **Backend :** Python 3.12, Django, Django REST Framework et Simple JWT.
- **Base de données :** SQLite par défaut; PostgreSQL peut être configuré.
- **Conteneurs :** Docker, Docker Compose et Nginx.

## Prérequis

Pour le démarrage local :

- Node.js et npm;
- Python 3.12 ou version compatible avec les dépendances du backend;
- Git (facultatif si le projet est déjà présent sur la machine).

Pour Docker : Docker Desktop avec Docker Compose.

## Démarrage local sous Windows

Ouvrez deux terminaux PowerShell dans le dossier du projet.

### 1. Démarrer l’API Django

Après l’installation des dépendances, créez `backend/.env` localement et
générez une clé Django privée :

```powershell
cd "C:\chemin\vers\Gestion ecole\backend"
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Copiez la clé affichée dans `backend/.env`, par exemple sous la forme
`SECRET_KEY=<votre-clé-privée>`. Ce fichier est local : ne le commitez pas et
ne partagez pas son contenu. Puis lancez Django :

```powershell
python manage.py migrate
python manage.py runserver 127.0.0.1:8000
```

Si PowerShell bloque l’activation de l’environnement virtuel, vous pouvez
appeler directement `.\.venv\Scripts\python.exe` à la place de `python`.

L’API est alors disponible à `http://127.0.0.1:8000/api/` et l’interface
d’administration Django à `http://127.0.0.1:8000/admin/`.

### 2. Démarrer le frontend

Dans un second terminal :

```powershell
cd "C:\chemin\vers\Gestion ecole"
npm ci
npm run dev
```

Vite affiche l’adresse locale, généralement `http://localhost:5173/`.
L’URL de l’API utilisée par le frontend est définie par `VITE_API_URL` et vaut
par défaut `http://127.0.0.1:8000/api`.

### Commandes utiles

À la racine du projet :

```powershell
npm run build
npm run lint
npm run preview
```

Dans `backend` :

```powershell
python manage.py check
python manage.py makemigrations
python manage.py migrate
```

## Démarrage avec Docker Compose

Le service backend charge `backend/.env`. Créez ce fichier localement avant de
lancer Compose et générez une clé secrète Django privée :

```powershell
cd "C:\chemin\vers\Gestion ecole\backend"
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Ajoutez la valeur affichée dans `backend/.env` sous la forme
`SECRET_KEY=<votre-clé-privée>`. Ne mettez pas la vraie valeur dans ce README,
dans GitHub ou dans un ticket. Puis, à la racine du projet :

```powershell
docker compose up --build
```

- Interface web : `http://localhost:5173/`
- API backend : `http://localhost:8000/api/`
- Administration Django : `http://localhost:8000/admin/`

Arrêter les services :

```powershell
docker compose down
```

Compose conserve la base de données, les médias et les fichiers statiques dans
des volumes Docker (`backend_db`, `backend_media`, `backend_static`).

Pour créer un administrateur dans la base Docker, ouvrez un autre terminal :

```powershell
docker compose exec backend python manage.py createsuperuser
docker compose exec backend python manage.py shell -c "from apps.accounts.models import User; u=User.objects.get(username='nom_utilisateur'); u.role='ADMIN'; u.save(update_fields=['role'])"
```

## Connexion et comptes

| Profil | Page de connexion | Tableau de bord |
| --- | --- | --- |
| Administrateur | `/administration/connexion` | `/dashboard/admin` |
| Élève | `/connexion` ou `/connexion/eleve` | `/dashboard/eleve` |
| Enseignant | `/connexion/enseignant` | `/dashboard/enseignant` |
| Parent | compte `PARENT` requis | `/dashboard/parent` |

Le dépôt ne fournit pas de mécanisme de création automatique d’un compte
administrateur. Les migrations créent le schéma, pas les identifiants. Créez
un compte via Django :

```powershell
cd "C:\chemin\vers\Gestion ecole\backend"
python manage.py createsuperuser
```

L’espace administrateur de l’application vérifie également le rôle `ADMIN`.
Après avoir créé le compte, affectez-lui ce rôle en remplaçant
`nom_utilisateur` par son identifiant :

```powershell
python manage.py shell -c "from apps.accounts.models import User; u=User.objects.get(username='nom_utilisateur'); u.role='ADMIN'; u.save(update_fields=['role'])"
```

Pour changer le mot de passe d’un compte existant :

```powershell
python manage.py changepassword nom_utilisateur
```

Il n’existe pas de compte de démonstration garanti par le dépôt. Le compte
administrateur doit être créé dans la base de données de l’installation avec
les commandes ci-dessus. Choisissez un mot de passe unique et robuste, et ne
l’inscrivez ni dans le dépôt ni dans un document partagé.

## Routes principales de l’API

Les routes sont préfixées par `http://127.0.0.1:8000/api/`. Sauf les routes
explicitement publiques, l’API utilise une authentification JWT.

| Préfixe | Ressource |
| --- | --- |
| `auth/` | Connexion, inscription, profil, obtention et renouvellement des jetons |
| `students/` | Élèves |
| `teachers/` | Enseignants |
| `classes/` | Classes |
| `subjects/` | Matières |
| `grades/` | Notes |
| `attendance/` | Présences et absences |
| `timetable/entries/` | Emploi du temps |
| `news/news/` | Actualités |
| `admissions/admissions/` | Admissions |
| `contact/messages/` | Messages de contact |
| `dashboard/overview/` | Indicateurs réservés à l’administration |
| `dashboard/public-statistics/` | Statistiques publiques |

Exemples d’authentification :

- `POST /api/auth/login/` — connexion et génération des jetons;
- `POST /api/auth/register/` — création d’un compte;
- `GET /api/auth/me/` — consultation du profil connecté;
- `PATCH /api/auth/me/` — mise à jour partielle du profil;
- `POST /api/auth/token/refresh/` — renouvellement d’un jeton.

## Configuration

Le backend lit les variables de configuration depuis `backend/.env` (ou
l’environnement du processus). Créez ce fichier sur votre machine; ne
remplacez pas la valeur secrète par une vraie clé dans un fichier suivi par
Git. Paramètres principaux :

| Variable | Rôle |
| --- | --- |
| `SECRET_KEY` | Clé secrète Django; à définir avec une valeur privée et aléatoire |
| `DEBUG` | Mode debug; à désactiver en production |
| `ALLOWED_HOSTS` | Hôtes acceptés par Django, séparés par des virgules |
| `DATABASE_ENGINE` | `sqlite` par défaut ou `postgresql` |
| `SQLITE_DB_PATH` | Chemin de la base SQLite |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT` | Connexion PostgreSQL |
| `EMAIL_BACKEND`, `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS` | Envoi des courriels |
| `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`, `DEFAULT_FROM_EMAIL` | Compte et adresse d’expédition |
| `VITE_API_URL` | URL de l’API intégrée au frontend au moment du build |

En développement, les courriels sont envoyés dans la sortie console Django par
défaut. Pour PostgreSQL ou un serveur de courriel, renseignez les paramètres
dans le fichier local `.env` correspondant; n’utilisez pas les valeurs de
développement en production.

## Arborescence

```text
.
├── src/                  # Application React/TypeScript
│   ├── Auth/              # Formulaires de connexion et d’inscription
│   ├── Page/Public/       # Pages et composants publics
│   ├── Page/Dashboard/    # Espaces par rôle
│   ├── api/               # Appels HTTP et services API
│   └── components/        # Composants partagés
├── backend/
│   ├── apps/              # Modules Django par domaine métier
│   ├── config/            # Configuration Django et routes racines
│   ├── manage.py
│   └── requirements.txt
├── Dockerfile             # Build frontend et serveur Nginx
├── Dockerfile.backend     # Image Django
└── docker-compose.yml     # Services frontend/backend et volumes
```

## Sécurité et données

- N’ajoutez jamais à Git de mots de passe, clés secrètes, jetons, bases de
  données, médias privés ou autres données personnelles.
- Les fichiers `.env` sont ignorés par Git, mais `.gitignore` ne désindexe pas
  un fichier déjà suivi. Avant publication, vérifiez les fichiers et l’historique
  des commits; révoquez tout secret qui aurait été exposé.
- En production, définissez une nouvelle `SECRET_KEY`, désactivez `DEBUG`,
  configurez les hôtes, CORS/CSRF, HTTPS et les sauvegardes de base de données.
- Les jetons de connexion du frontend sont conservés dans `localStorage`;
  protégez les postes utilisateurs et évitez les environnements partagés.
- L’API Django utilise SQLite par défaut. Pour plusieurs utilisateurs ou un
  déploiement de production, configurez et sauvegardez une base PostgreSQL.
