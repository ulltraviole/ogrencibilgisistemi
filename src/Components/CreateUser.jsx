import { useState } from "react";
import { createUser } from "../Modules/Firebase";
import Swal from "sweetalert2";

export default function CreateUser() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true); // İşlem başlamadan önce loading durumunu true yap

    const getValue = (elName) => e.target.elements.namedItem(elName).value;

    const email = getValue("email");
    const password = getValue("password");
    const displayName = getValue("displayName");
    const authLevel = getValue("authlevel");

    // E-posta adresinin gazi.edu.tr alan adına sahip olup olmadığını kontrol et
    if (!email.endsWith("@gazi.edu.tr")) {
      Swal.fire({
        icon: "error",
        titleText: "Hata",
        text: "Lütfen geçerli bir gazi.edu.tr e-posta adresi girin.",
      });
      setLoading(false); // Hata durumunda loading durumunu false yap
      return;
    }

    createUser({ email, password, displayName, authLevel })
      .then((result) => {
        console.log(result);
        Swal.fire({
          icon: "success",
          titleText: "Başarılı",
          text: "Kullanıcı başarıyla oluşturuldu.",
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          titleText: "Hata",
          text: "Kullanıcı oluşturulamadı.",
        });
      })
      .finally(() => {
        setLoading(false); // İşlem tamamlandığında loading durumunu false yap
      });
  };

  return (
    <form id="form" onSubmit={handleSubmit} className="container-fluid px-1">
      <label htmlFor="displayName">Tam Adı</label>
      <input
        name="displayName"
        type="text"
        className="form-control p-3"
        placeholder="Ad Soyad"
        minLength="3"
        required
      />
      <label htmlFor="authlevel">Yetki Seviyesi</label>
      <select form="form" name="authlevel" className="form-select p-3">
        <option value="1">Öğrenci</option>
        <option value="2">Akademisyen</option>
        <option value="3">Yönetici</option>
      </select>
      <label htmlFor="email">E-posta Adresi</label>
      <input
        name="email"
        type="email"
        className="form-control p-3"
        placeholder="k.adi@gazi.edu.tr"
        autoComplete="off"
        required
      />
      <label htmlFor="password">Kullanıcı Şifresi</label>
      <input
        name="password"
        type="password"
        className="form-control p-3"
        placeholder="******"
        minLength="6"
        required
      />
      <input
        type="submit"
        className="btn btn-primary p-3 mt-1 container-fluid"
        value={loading ? "İşleniyor..." : "Kullanıcı Oluştur"}
        disabled={loading} // İşlem sırasında butonun tıklanmasını engelle
      />
    </form>
  );
}
