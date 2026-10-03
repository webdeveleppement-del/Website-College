from django.conf import settings
from django.db import models


class Student(models.Model):

    class Gender(models.TextChoices):
        MASCULIN = "M", "Masculin"
        FEMININ = "F", "Feminin"

    class Status(models.TextChoices):
        ACTIF = "ACTIF", "Actif"
        INACTIF = "INACTIF", "Inactif"
        DIPLOME = "DIPLOME", "Diplome"

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="student_profile",
    )

    matricule = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="Matricule",
    )

    date_naissance = models.DateField(
        null=True,
        blank=True,
        verbose_name="Date de naissance",
    )

    lieu_naissance = models.CharField(
        max_length=150,
        blank=True,
        verbose_name="Lieu de naissance",
    )

    sexe = models.CharField(
        max_length=1,
        choices=Gender.choices,
        blank=True,
        verbose_name="Sexe",
    )

    adresse = models.TextField(
        blank=True,
        verbose_name="Adresse",
    )

    classe = models.ForeignKey(
        "classes.SchoolClass",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="students",
        verbose_name="Classe",
    )

    date_inscription = models.DateField(
        auto_now_add=True,
        verbose_name="Date d'inscription",
    )

    statut = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIF,
        verbose_name="Statut",
    )

    class Meta:
        ordering = ["user__last_name", "user__first_name"]
        verbose_name = "Élève"
        verbose_name_plural = "Élèves"

    def __str__(self):
        return f"{self.user.get_full_name()} - {self.matricule}"
