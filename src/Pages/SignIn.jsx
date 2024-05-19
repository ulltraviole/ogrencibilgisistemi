import { useNavigate } from "react-router-dom";
import Authenticate from "../Modules/Authenticate";
import { auth } from "../Modules/Firebase";
import styles from "./../Styles/Login.module.css"; // Custom CSS (React Module CSS)
import { useAuthState } from "react-firebase-hooks/auth";
import Swal from "sweetalert2"; // For inform user.

export default function SignIn() {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  async function handleSubmit(e) {
    e.preventDefault();
    function getValue(elName) {
      return e.target.elements.namedItem(elName).value;
    }
    try {
      await Authenticate(getValue("email"), getValue("password"));
    } catch (error) {
      console.error(error.code, error.message);
      Swal.fire({
        icon: "error",
        titleText: "Hata",
        text: "Bilgilerinizi kontrol ediniz.",
        timer: 3000,
      });
    }
  }
  if (loading) {
    return "Loading...";
  }
  if (error) {
    return "Error.";
  }

  if (user) {
    Swal.fire({
      icon: "success",
      titleText: "Başarılı",
      text: "Başarıyla giriş yaptınız. Lütfen bekleyiniz.",
      timer: 3000,
      timerProgressBar: true,
    }).then(() => {
      navigate("/dashboard");
    });
  } else if (user === null) {
    return (
      <div className={styles.LoginCollapser}>
        <span>Kullanıcı Doğrulama Arayüzü</span>
        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="adiniz@kurumunuz.edu.tr"
            className={styles.tckn}
            autoComplete="off"
            required
            autoFocus
          />
          <input
            name="password"
            type="password"
            placeholder="******"
            className={styles.pass}
            required
          />
          <input type="submit" value="Giriş yap" />
        </form>
      </div>
    );
  }
}
