import { collection, getDocs } from "firebase/firestore";
import { db, getUser } from "../Modules/Firebase";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function ListLecturersLessons({ lecturer, uid }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState();

  useEffect(() => {
    const fetchLessons = async () => {
      if (!lecturer && !uid) {
        Swal.fire({
          icon: "error",
          titleText: "Hata",
          text: "Geçerli bir kullanıcı ID'si yok.",
        });
        return;
      }
      if (!lecturer && uid) {
        getUser({ uid: uid }).then((result) => {
          setUser(result.data);
        });
      }
      setLoading(true);
      setLessons([]); // Yeni akademisyen seçildiğinde tabloyu boşalt
      try {
        const querySnapshot = await getDocs(collection(db, "dersler"));
        const lessonsData = [];
        querySnapshot.forEach((doc) => {
          let filteredSubeler;
          const data = doc.data();
          if (lecturer) {
            filteredSubeler = data.Subeler.filter(
              (sube) => sube.AkademisyenUID === lecturer.uid
            );
          }
          if (uid) {
            filteredSubeler = data.Subeler.filter(
              (sube) => sube.AkademisyenUID === uid
            );
          }
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
  }, [lecturer, uid]);

  return (
    <div className="container-fluid px-1">
      {lecturer && (
        <div>
          <h2 className="p-3">
            {lecturer.displayName} - {lecturer.email}
          </h2>
        </div>
      )}
      {uid && user && (
        <div>
          <h2 className="p-3">
            {user.displayName} - {user.email}
          </h2>
        </div>
      )}
      {/* Akademisyen bilgilerini gösteriyoruz */}
      {loading ? (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
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
                      <span key={sube.SubeNo} className="badge bg-primary mx-1">
                        Şube {sube.SubeNo}
                      </span>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
