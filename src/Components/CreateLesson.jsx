import { doc, setDoc } from "firebase/firestore";
import { db, getUsers } from "../Modules/Firebase";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export default function CreateLesson() {
  const [subeler, setSubeler] = useState([{ SubeNo: 1, AkademisyenUID: "" }]);
  const [lecturers, setLecturers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getUsers({ authLevel: "2" })
      .then((lecturers) => {
        setLecturers(lecturers.data);
        setSubeler([{ SubeNo: 1, AkademisyenUID: lecturers.data[0]?.uid }]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching lecturers: ", error);
        setLoading(false);
        Swal.fire({
          icon: "error",
          titleText: "Hata",
          text: "Akademisyenler yüklenemedi.",
        });
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const lessonData = {
      DersAdi: formData.get("lesson"),
      DersKredisi: formData.get("kredi"),
      Subeler: subeler.map((sube, index) => ({
        SubeNo: sube.SubeNo,
        AkademisyenUID: lecturers.find(
          (lecturer) => lecturer.email === formData.get(`sube-${index}-email`)
        )?.uid,
      })),
    };

    try {
      await setDoc(doc(db, "dersler", formData.get("code")), lessonData);
      Swal.fire({
        icon: "success",
        titleText: "Başarılı",
        text: "Ders başarıyla kaydedildi.",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        titleText: "Hata",
        text: "Ders kaydedilemedi.",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSubeChange = (e) => {
    const subeCount = Number(e.target.value);
    const newSubeler = Array.from({ length: subeCount }, (_, index) => ({
      SubeNo: index + 1,
      AkademisyenUID: lecturers[0]?.uid || "",
    }));
    setSubeler(newSubeler);
  };

  return (
    <form onSubmit={handleSubmit} className="container-fluid px-1">
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && (
        <>
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
          />
          <label htmlFor="subeSayisi">Dersin Şube Sayısını Seçiniz</label>
          <select
            className="form-control p-3"
            name="subeSayisi"
            id="subeSayisi"
            required
            onChange={handleSubeChange}
          >
            {[1, 2, 3].map((number) => (
              <option key={number} value={number}>
                {number}
              </option>
            ))}
          </select>
          {subeler.map((sube, index) => (
            <div key={index}>
              <label htmlFor={`sube-${index}-email`}>
                {`${sube.SubeNo}. şubenin dersini verecek akademisyeni seçiniz.`}
              </label>
              <select
                className="form-control p-3"
                name={`sube-${index}-email`}
                id={`sube-${index}-email`}
                required
              >
                {lecturers.map((lecturer) => (
                  <option key={lecturer.uid} value={lecturer.email}>
                    {lecturer.email}
                  </option>
                ))}
              </select>
            </div>
          ))}
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
        </>
      )}
    </form>
  );
}
