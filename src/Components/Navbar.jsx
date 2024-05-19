import { signOut } from "firebase/auth";
import { auth } from "../Modules/Firebase";

/* eslint-disable jsx-a11y/anchor-is-valid */
export default function Navbar(props) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <nav className="navbar bg-light">
      <div className="container-fluid">
        {/* <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon" />
        </button> */}
        <a className="navbar-brand mx-auto" href="#">
          Öğrenci Bilgilendirme Sistemi - {props.role}
        </a>

        <span className="nav-item">
          <span>{props.email}</span>
          <a
            className="nav-link active text-center"
            aria-current="page"
            id="sign-out"
            href="#"
            onClick={handleSignOut}
          >
            Çıkış Yap
          </a>
        </span>
        {/* <div
          className="offcanvas offcanvas-start"
          tabIndex={-1}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Öğrenci İşlem Listesi
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="#">
                  Anasayfa
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Ders İşlemleri
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Ders Kayıtlanma
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Ders Ekleme - Bırakma
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Haftalık Ders Programı
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Not İşlemleri
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Not Durumu Görüntüleme
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Sınav Notu Görüntüleme
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Transkript
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Sınav İşlemleri
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Sınav Tarihi Görüntüleme
                    </a>
                  </li>
                </ul>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Kişisel Bilgiler
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="#">
                      Temel Bilgiler
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      İletişim Bilgileri
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div> */}
      </div>
    </nav>
  );
}
