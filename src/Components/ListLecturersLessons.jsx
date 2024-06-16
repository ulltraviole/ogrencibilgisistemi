import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../Modules/Firebase";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import htmlToPdfmake from "html-to-pdfmake";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function ListLecturersLessons({ lecturer }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subeData, setSubeData] = useState([]);
  const [ogrenciData, setOgrenciData] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const getValue = (elName) => e.target.elements.namedItem(elName).value;

    const lessonRef = doc(db, "dersler", ogrenciData[0].dersId);
    const lessonSnapshot = await getDoc(lessonRef);
    const lessonData = lessonSnapshot.data();

    const updatedSubeler = lessonData.Subeler.map((sube, index) => {
      if (index === ogrenciData[0].subeNo - 1) {
        return {
          ...sube,
          DersiAlanlar: sube.DersiAlanlar
            ? [
                ...sube.DersiAlanlar,
                {
                  mail: ogrenciData[0].ogrenciMail,
                  devamsizlik: getValue("devamsizlik"),
                },
              ]
            : [
                {
                  mail: ogrenciData[0].ogrenciMail,
                  devamsizlik: getValue("devamsizlik"),
                },
              ],
        };
      }
      return sube;
    });

    try {
      await updateDoc(lessonRef, { Subeler: updatedSubeler });
      Swal.fire({
        icon: "success",
        titleText: "Başarılı",
        text: "Öğrenci ilgili derse başarıyla kaydedildi.",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        titleText: "Hata",
        text: "Öğrenci derse kaydedilirken bir hata oluştu.",
      });
    }
  };

  useEffect(() => {
    const fetchLessons = async () => {
      if (!lecturer || !lecturer.uid) {
        Swal.fire({
          icon: "error",
          titleText: "Hata",
          text: "Geçerli bir kullanıcı ID'si yok.",
        });
        return;
      }

      setLoading(true);
      setLessons([]); // Yeni akademisyen seçildiğinde tabloyu boşalt
      try {
        const querySnapshot = await getDocs(collection(db, "dersler"));
        const lessonsData = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const filteredSubeler = data.Subeler.filter(
            (sube) => sube.AkademisyenUID === lecturer.uid
          );

          if (filteredSubeler.length > 0) {
            lessonsData.push({
              id: doc.id,
              data: data,
              subeler: filteredSubeler,
            });
          }
        });
        setLessons(lessonsData);
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          titleText: "Hata",
          text: "Dersler alınırken bir hata oluştu.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [lecturer]);

  return (
    <div className="container-fluid px-1">
      {lecturer && (
        <div>
          <h2 className="p-3">
            {lecturer.displayName} - {lecturer.email}
          </h2>
        </div>
      )}
      {loading ? (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      ) : (
        <>
          <table className="table table-dark table-striped text-center">
            <thead>
              <tr>
                <th>Ders Kodu</th>
                <th>Ders Adı</th>
                <th>Dersin Kredisi</th>
                <th>Şubeler</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => (
                <tr key={lesson.id}>
                  <td>{lesson.id}</td>
                  <td>{lesson.data.DersAdi}</td>
                  <td>{lesson.data.DersKredisi}</td>
                  <td>
                    {lesson.subeler.map((sube) => (
                      <span
                        key={sube.SubeNo}
                        style={{ cursor: "pointer" }}
                        className="badge bg-primary mx-1"
                        onClick={() => {
                          setSubeData([]);
                          if (!sube.DersiAlanlar) {
                            Swal.fire({
                              titleText: "Bilgilendirme",
                              icon: "info",
                              text: "Bu şubede herhangi bir öğrenci bulunmuyor.",
                            });
                          } else {
                            sube.DersAdi = lesson.data.DersAdi;
                            sube.DersId = lesson.id;
                            setSubeData(sube);
                          }
                        }}
                      >
                        Şube {sube.SubeNo}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {subeData?.DersiAlanlar?.length > 0 && (
            <>
              <table
                id="dersialanlar"
                className="table table-dark table-striped text-center"
              >
                <thead>
                  <tr>
                    <th>
                      {subeData.DersAdi} ({subeData.SubeNo}. Şube) Dersini Alan
                      Öğrenciler
                    </th>
                    <th>Öğrenci İşlemleri</th>
                  </tr>
                </thead>
                <tbody>
                  {subeData.DersiAlanlar.map((ogrenci) => {
                    return (
                      <tr key={ogrenci.mail}>
                        <td>
                          <span>{ogrenci.mail}</span>
                        </td>
                        <td>
                          <button
                            style={{ cursor: "pointer" }}
                            className="btn btn-primary mx-1"
                            onClick={() => {
                              setOgrenciData([]);
                              setOgrenciData([
                                {
                                  ogrenciMail: ogrenci.mail,
                                  dersAdi: subeData.DersAdi,
                                  dersId: subeData.DersId,
                                  subeNo: subeData.SubeNo,
                                },
                              ]);
                            }}
                          >
                            Devamsızlık Girişi Yap
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button
                type="button"
                className="btn btn-primary container-fluid"
                onClick={() => {
                  let val = [];
                  htmlToPdfmake(
                    document.getElementById("dersialanlar").innerHTML
                  ).forEach((v) => {
                    if (v.style?.length !== 4) {
                      if (v.text.endsWith("İşlemleri")) {
                        val.push(v.text.split("Öğrenci İşlemleri")[0]);
                      } else {
                        val.push(v);
                      }
                    }
                  });
                  pdfMake
                    .createPdf({
                      content: val,
                      watermark: "Gazi Üniversitesi",
                      defaultStyle: { alignment: "center", lineHeight: 1.5 },
                    })
                    .download(() => {
                      Swal.fire({
                        titleText: "Başarılı",
                        text: "Öğrenci listesi indirildi.",
                        confirmButtonText: "Tamam",
                        icon: "success",
                      });
                    });
                }}
              >
                Öğrencilerin Çıktısını Al
              </button>
            </>
          )}
          {ogrenciData[0]?.ogrenciMail?.length > 0 && (
            <form
              className="container-fluid p-3 w-25 mx-auto"
              onSubmit={handleSubmit}
            >
              <input
                className="form-control"
                type="email"
                name="email"
                id="email"
                defaultValue={ogrenciData[0].ogrenciMail}
                hidden
              />
              <div>Öğrencinin E-Posta Adresi: {ogrenciData[0].ogrenciMail}</div>
              <label htmlFor="devamsizlik" className="form-label">
                Öğrencinin toplam devamsızlık sayısını seçiniz.
              </label>
              <select
                className="form-control text-black"
                type="number"
                name="devamsizlik"
                id="devamsizlik"
                placeholder="..."
              >
                <option value={1}>1 Hafta</option>
                <option value={2}>2 Hafta</option>
                <option value={3}>3 Hafta</option>
                <option value={4}>4 Hafta</option>
                <option value={5}>5 Hafta</option>
                <option value={6}>6 Hafta</option>
                <option value={7}>7 Hafta</option>
                <option value={8}>8 Hafta</option>
                <option value={9}>9 Hafta</option>
                <option value={10}>10 Hafta</option>
                <option value={11}>11 Hafta</option>
                <option value={12}>12 Hafta</option>
                <option value={13}>13 Hafta</option>
                <option value={14}>14 Hafta</option>
              </select>
              <button
                type="submit"
                className="btn btn-success container-fluid mt-1"
              >
                Kaydet
              </button>
            </form>
          )}
        </>
      )}
    </div>
  );
}
