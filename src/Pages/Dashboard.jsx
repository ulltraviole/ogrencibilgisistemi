import { auth } from "../Modules/Firebase";
import { signOut } from "firebase/auth";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import "./Dashboard.css"; // Add your custom CSS file here

// Yönetici Componentleri
import CreateLesson from "../Components/CreateLesson";
import ListLessons from "../Components/ListLessons";
import CreateUser from "../Components/CreateUser";
import ListLecturers from "../Components/ListLecturers";

// Akademisyen Componentleri
import ListStudents from "../Components/ListStudents";
import BindLessonToStudent from "../Components/BindLessonToStudent";
import ListLecturersLessons from "../Components/ListLecturersLessons";

// Öğrenci Componentleri
import ListStudentsLessons from "../Components/ListStudentsLessons";
import DeleteStudent from "../Components/DeleteStudent";

export default function Dashboard() {
  const [authLevel, user] = useOutletContext();
  const [showCreateLesson, setShowCreateLesson] = useState(false);
  const [showListLessons, setShowListLessons] = useState(false);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showDeleteStudent, setShowDeleteStudent] = useState(false);
  const [showListLecturers, setShowListLecturers] = useState(false);
  const [showListStudents, setShowListStudents] = useState(false);
  const [showBindLessonToStudent, setShowBindLessonToStudent] = useState(false);
  const [showListLecturersLessons, setShowListLecturersLessons] =
    useState(false);
  const [showListStudentsLessons, setShowListStudentsLessons] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const hideAll = () => {
    setShowCreateLesson(false);
    setShowListLessons(false);
    setShowCreateUser(false);
    setShowDeleteStudent(false);
    setShowListLecturers(false);
    setShowListStudents(false);
    setShowBindLessonToStudent(false);
    setShowListLecturersLessons(false);
    setShowListStudentsLessons(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="d-flex bg-dark">
      <div
        className={`d-flex flex-column flex-shrink-0 text-white bg-dark pt-3 shadow rounded ${
          sidebarOpen ? "active" : ""
        }`}
        style={{
          width: 300,
          height: "100vh",
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <div className="w-100 text-center mx-auto">
          <strong>Öğrenci Bilgi Sistemi</strong>
        </div>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto pl-3">
          {authLevel === "3" && (
            <div>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowListLecturers(true);
                  }}
                >
                  Akademisyen Listesi
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowListStudents(true);
                  }}
                >
                  Öğrenci Listesi
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowListLessons(true);
                  }}
                >
                  Ders Listesi
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowCreateUser(true);
                  }}
                >
                  Kullanıcı Oluştur
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowDeleteStudent(true);
                  }}
                >
                  Öğrenci Sil
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowCreateLesson(true);
                  }}
                >
                  Ders Oluştur
                </span>
              </li>
            </div>
          )}
          {authLevel === "2" && (
            <div>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowListStudents(true);
                  }}
                >
                  Öğrenci Listesi
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowListLecturersLessons(true);
                  }}
                >
                  Verdiğim Dersler Listesi
                </span>
              </li>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowBindLessonToStudent(true);
                  }}
                >
                  Öğrenciye Ders Ekle
                </span>
              </li>
            </div>
          )}
          {authLevel === "1" && (
            <div>
              <li className="nav-item">
                <span
                  className="nav-link text-white"
                  onClick={() => {
                    hideAll();
                    setShowListStudentsLessons(true);
                  }}
                >
                  Aldığım Dersler
                </span>
              </li>
            </div>
          )}
          <div>
            <li className="nav-item">
              <span className="nav-link text-white" onClick={handleSignOut}>
                Çıkış Yap
              </span>
            </li>
          </div>
        </ul>
        <hr />
        <div className="d-flex flex-column pb-3 text-center">
          <strong>Ad Soyad</strong>
          <span>{user.displayName}</span>
          <strong>E-Posta Adresi</strong>
          <span>{user.email}</span>
        </div>
      </div>

      <main className="container-fluid text-white mt-3">
        <button
          className="btn btn-primary d-md-none mb-3 w-100"
          onClick={toggleSidebar}
        >
          İşlem Menüsü
        </button>
        {showListLecturers && <ListLecturers />}
        {showListLessons && <ListLessons />}
        {showCreateUser && <CreateUser />}
        {showDeleteStudent && <DeleteStudent />}
        {showCreateLesson && <CreateLesson />}
        {showListStudents && <ListStudents />}
        {showListLecturersLessons && <ListLecturersLessons uid={user.uid} />}
        {showBindLessonToStudent && <BindLessonToStudent />}
        {showListStudentsLessons && <ListStudentsLessons email={user.email} />}
      </main>
    </div>
  );
}
