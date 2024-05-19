import { setAuthLevel } from "../Modules/Firebase";

import Swal from "sweetalert2";

export default function SetAuthLevel() {
  const handleSubmit = (e) => {
    e.preventDefault();
    function getValue(elName) {
      return e.target.elements.namedItem(elName).value;
    }
    setAuthLevel({
      email: getValue("email"),
      authLevel: getValue("authlevel"),
    })
      .then((result) => {
        console.log(result);
        Swal.fire({
          icon: "success",
          titleText: "Başarılı",
          text: "Yetki seviyesi başarıyla güncellendi.",
        });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          titleText: "Hata",
          text: "Yetki seviyesi güncellenemedi.",
        });
      });
  };
  return (
    <form id="authform" onSubmit={handleSubmit} className="container-fluid px-1">
      <label htmlFor="email">
        Rolünü değiştirmek istediğiniz kişinin e-posta adresini giriniz.
      </label>
      <input
        type="email"
        className="form-control"
        name="email"
        id="email"
        required
      />
      <label htmlFor="authlevel">Yetki Seviyesi</label>
      <select form="authform" name="authlevel" className="form-select mt-1">
        <option value="1">Öğrenci</option>
        <option value="2">Akademisyen</option>
        <option value="3">Yönetici</option>
      </select>
      <input
        type="submit"
        className="btn btn-primary container-fluid mt-1"
        value={"Yetkisini Güncelle"}
      />
    </form>
  );
}
