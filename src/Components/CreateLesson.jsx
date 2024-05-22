import { doc, setDoc } from "firebase/firestore";
import { db, getLecturerUID, getUsers } from "../Modules/Firebase";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function CreateLesson() {
  const [lecturers, setLecturers] = useState([]);
  useEffect(() => {
    getUsers({ authLevel: "2" }).then((lecturers) => {
      setLecturers([]);
      lecturers.data.forEach((lecturer) => {
        setLecturers((lecturers) => [...lecturers, lecturer]);
      });
    });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    function getValue(elName) {
      return e.target.elements.namedItem(elName).value;
    }
    getLecturerUID({ email: getValue("email") })
      .then((result) => {
        setDoc(doc(db, "dersler", getValue("code")), {
          AkademisyenUID: result.data,
          DersAdi: getValue("lesson"),
          DersKredisi: getValue("kredi"),
        })
          .then(() => {
            Swal.fire({
              icon: "success",
              titleText: "Başarılı",
              text: "Ders başarıyla kaydedildi.",
            });
          })
          .catch((err) => {
            console.error(err);
            Swal.fire({
              icon: "error",
              titleText: "Hata",
              text: "Ders kaydedilemedi.",
            });
          });
      })
      .catch((err) => {
        console.error(err);
        Swal.fire({
          icon: "error",
          titleText: "Hata",
          text: "Girdiğiniz e-posta adresini ve ders kodunu kontrol ediniz.",
        });
      });
  }
  return (
    <form onSubmit={handleSubmit} className="container-fluid px-1">
      <label htmlFor="lesson">
        Oluşturmak istediğiniz dersin adını giriniz.
      </label>
      <input
        name="lesson"
        type="text"
        className="form-control p-3"
        placeholder="Sistem Analizi ve Tasarımı"
        autoComplete="off"
        required
        autoFocus
      />
      <label htmlFor="code">
        Oluşturmak istediğiniz dersin kodunu giriniz.
      </label>
      <input
        name="code"
        type="text"
        className="form-control p-3"
        placeholder="BIL100"
        autoComplete="off"
        required
        autoFocus
      />

      <label htmlFor="email">Dersi verecek olan akademisyeni seçiniz.</label>
      {/* <input
        name="email"
        type="email"
        className="form-control p-3"
        placeholder="k.adi@kurumunuz.edu.tr"
        autoComplete="off"
        required
      /> */}
      <select className="form-control p-3" name="email" id="email" required>
        {lecturers.map((lecturer) => {
          return (
            <option key={lecturer.uid} value={lecturer.email}>
              {lecturer.email}
            </option>
          );
        })}
      </select>
      <label htmlFor="kredi">Dersin kredisi</label>
      <input
        name="kredi"
        type="number"
        className="form-control p-3"
        placeholder="3"
        autoComplete="off"
        required
      />
      <input
        type="submit"
        className="btn btn-primary p-3 mt-1 container-fluid"
        value="Ders Oluştur"
      />
    </form>
  );
}
