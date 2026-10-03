import Navbar from "./Page/Public/Navbar"
import Footer from "./Page/Public/Footer"
import Login from "./Auth/Login"
import AdminLogin from "./Auth/AdminLogin"
import DestinationPage from "./Page/Public/DestinationPage"
import Inscription from "./Page/Public/Inscription"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AdminDashboard from "./Page/Dashboard/Admin/AdminDashboard"
import Eleves from "./Page/Dashboard/Admin/Eleves/Eleves"
import Enseignants from "./Page/Dashboard/Admin/Enseignants/Enseignants"
import Classes from "./Page/Dashboard/Admin/Classes/Classes"
import Matieres from "./Page/Dashboard/Admin/Matieres/Matieres"
import Notes from "./Page/Dashboard/Admin/Notes"
import Presences from "./Page/Dashboard/Admin/Presences/Presences"
import EmploiDuTemps from "./Page/Dashboard/Admin/EmploiDuTemps/EmploiDuTemps"
import { Actualites, Admissions, Messages } from "./Page/Dashboard/Admin/Communication/AdminCommunication"
import AdminParametres from "./Page/Dashboard/Admin/Parametres/AdminParametres"
import EnseignantDashboard from "./Page/Dashboard/Enseignant/EnseignantDashboard"
import EleveDashboard from "./Page/Dashboard/Eleve/EleveDashboard"
import CookieBanner from "./components/CookieBanner"
import {
  Route,
  Routes,
} from "react-router-dom"

function HomePage() {
  return (
    <>
      <Navbar />
      <Footer />
    </>
  )
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
      <Route path="/connexion" element={<Login fixedRole="ELEVE" />} />
      <Route path="/connexion/eleve" element={<Login fixedRole="ELEVE" />} />
      <Route path="/connexion/enseignant" element={<Login fixedRole="ENSEIGNANT" />} />
      <Route path="/administration/connexion" element={<AdminLogin />} />
      <Route path="/inscription" element={<Inscription />} />

      <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
        <Route
          path="/dashboard/admin"
          element={<AdminDashboard />}
        />
        <Route path="/dashboard/admin/eleves" element={<Eleves />} />
        <Route path="/dashboard/admin/enseignants" element={<Enseignants />} />
        <Route path="/dashboard/admin/classes" element={<Classes />} />
        <Route path="/dashboard/admin/matieres" element={<Matieres />} />
        <Route path="/dashboard/admin/notes" element={<Notes />} />
        <Route path="/dashboard/admin/presences" element={<Presences />} />
        <Route path="/dashboard/admin/emploi-du-temps" element={<EmploiDuTemps />} />
        <Route path="/dashboard/admin/actualites" element={<Actualites />} />
        <Route path="/dashboard/admin/admissions" element={<Admissions />} />
        <Route path="/dashboard/admin/messages" element={<Messages />} />
        <Route path="/dashboard/admin/parametres" element={<AdminParametres />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<ProtectedRoute allowedRoles={["ENSEIGNANT"]} />}>
          <Route path="/dashboard/enseignant" element={<EnseignantDashboard />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["ELEVE"]} />}>
          <Route path="/dashboard/eleve" element={<EleveDashboard />} />
        </Route>
        <Route path="/dashboard/parent" element={<DestinationPage />} />
      </Route>

        <Route path="*" element={<DestinationPage />} />
      </Routes>
      <CookieBanner />
    </>
  )
}

export default App
