import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Modules/Firebase";
import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function DashboardLayout() {
  const [user, loading, error] = useAuthState(auth);
  const [authLevel, setAuthLevel] = useState("0");
  if (loading) {
    return "Loading...";
  }
  if (error) {
    return "Error.";
  }
  if (user) {
    user.getIdTokenResult(true).then((user) => {
      setAuthLevel(user.claims.authLevel);
    });
    return (
      <>
        <Outlet context={[authLevel, user]} />
      </>
    );
  } else if (user === null) {
    return <Navigate to="/giris" replace={true} />;
  }
}
