import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";


interface ProtectedRouteProps {

  allowedRoles?: string[];
}


export default function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {

  const {
    user,
    loading,
  } = useAuth();

  const location =
    useLocation();


  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui",
        }}
      >
        Chargement...
      </div>
    );
  }


  if (!user) {

    return (
      <Navigate
        to="/connexion"
        state={{
          from: location.pathname,
        }}
        replace
      />
    );
  }


  if (
    allowedRoles &&
    !allowedRoles.includes(
      user.role
    )
  ) {

    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  return <Outlet />;
}
