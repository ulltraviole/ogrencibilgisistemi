import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Authenticate from "../Modules/Authenticate";
import { auth } from "../Modules/Firebase";
import styles from "./../Styles/Login.module.css"; // Custom CSS (React Module CSS)
import { useAuthState } from "react-firebase-hooks/auth";
import Swal from "sweetalert2"; // For informing the user.

const Spinner = () => (
  <div className="spinner-container">
    <div className="spinner"></div>
  </div>
);

const SignIn = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [loadingAuth, setLoadingAuth] = useState(false); // Yeni state tanımladık

  async function handleSubmit(e) {
    e.preventDefault();
    function getValue(elName) {
      return e.target.elements.namedItem(elName).value;
    }
    try {
      setLoadingAuth(true); // Submit işlemi başladığında loadingAuth durumunu true yap
      await Authenticate(getValue("email"), getValue("password"));
    } catch (error) {
      console.error(error.code, error.message);
      Swal.fire({
        icon: "error",
        titleText: "Hata",
        text: "Bilgilerinizi kontrol ediniz.",
        timer: 3000,
      });
    } finally {
      setLoadingAuth(false); // İşlem tamamlandığında loadingAuth durumunu false yap
    }
  }

  if (error) {
    return "Error.";
  }

  if (user) {
    Swal.fire({
      icon: "success",
      titleText: "Başarılı",
      text: "Başarıyla giriş yaptınız. Lütfen bekleyiniz.",
      timer: 2500,
      timerProgressBar: true,
    }).then(() => {
      navigate("/dashboard");
    });
  } else if (user === null) {
    return (
      <div className={`${styles.LoginCollapser} bg-dark`}>
        {(loading || loadingAuth) && <Spinner />}
        <span>Kullanıcı Doğrulama Arayüzü</span>
        <form onSubmit={handleSubmit} className="shadow">
          <input
            name="email"
            type="email"
            placeholder="adiniz@kurumunuz.edu.tr"
            className={`${styles.tckn} shadow rounded bg-dark`}
            autoComplete="off"
            required
            autoFocus
          />
          <input
            name="password"
            type="password"
            placeholder="******"
            className={`${styles.pass} mt-2 rounded bg-dark shadow`}
            required
          />
          <input
            type="submit"
            className="btn btn-primary mt-2 shadow"
            value="Giriş Yap"
          />
        </form>
      </div>
    );
  }
};

export default SignIn;
