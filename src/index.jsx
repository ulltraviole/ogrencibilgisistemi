// React Core
import React from "react";
// React DOM
import ReactDOM from "react-dom/client";
// Router
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Layouts
import DashboardLayout from "./Layouts/DashboardLayout";
// Pages
import Home from "./Pages/Home";
import SignIn from "./Pages/SignIn";
// import CreateUser from "./Pages/CreateUser";
import NoMatch from "./Pages/NoMatch";
import Dashboard from "./Pages/Dashboard";
// Core CSS
import "./Styles/Global.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="giris" element={<SignIn />} />
        <Route path="dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
