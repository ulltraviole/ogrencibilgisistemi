import { createUser } from "../Modules/Firebase";

import Swal from "sweetalert2"; // For inform user.

export default function CreateUser() {
  async function handleSubmit(e) {
    e.preventDefault();
    function getValue(elName) {
      return e.target.elements.namedItem(elName).value;
    }
    createUser({
      email: getValue("email"),
      password: getValue("password"),
      displayName: getValue("displayName"),
      authLevel: getValue("authlevel"),
    })
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
      });
  }
  return (
    <form id="form" onSubmit={handleSubmit} className="container-fluid px-1">
      <label htmlFor="displayName">Tam Adı</label>
      <input
        name="displayName"
        type="text"
        className="form-control"
        placeholder="Ad Soyad"
        required
      />
      <label htmlFor="authlevel">Yetki Seviyesi</label>
      <select form="form" name="authlevel" className="form-select">
        <option value="1">Öğrenci</option>
        <option value="2">Akademisyen</option>
        <option value="3">Yönetici</option>
      </select>
      <label htmlFor="email">E-posta Adresi</label>
      <input
        name="email"
        type="email"
        className="form-control"
        placeholder="k.adi@kurumunuz.edu.tr"
        autoComplete="off"
        required
      />
      <label htmlFor="password">Kullanıcı Şifresi</label>
      <input
        name="password"
        type="password"
        className="form-control"
        placeholder="******"
        required
      />
      <input
        type="submit"
        className="btn btn-primary mt-1 container-fluid"
        value="Kullanıcı Oluştur"
      />
    </form>
  );
}
