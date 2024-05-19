import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../Modules/Firebase";
import { useState } from "react";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "./../Components/Navbar";
export default function DashboardLayout() {
  const [user, loading, error] = useAuthState(auth);
  const [authLevel, setAuthLevel] = useState("0");
  const [role, setRole] = useState("Yükleniyor");
  useEffect(() => {
    switch (authLevel) {
      case "1":
        setRole("Öğrenci");
        break;
      case "2":
        setRole("Akademisyen");
        break;
      case "3":
        setRole("Yönetici");
        break;
      default:
        break;
    }
  }, [authLevel]);
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
        <Navbar role={role} email={user.email} />
        <Outlet context={[authLevel, user]} />
      </>
    );
  } else if (user === null) {
    return <Navigate to="/giris" replace={true} />;
  }
}
