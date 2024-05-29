import { collection, query, getDocs } from "firebase/firestore";
import { db, getDisplayNameFromUID } from "../Modules/Firebase";
import { useState } from "react";

export default function ListLessons() {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "dersler"));
      const querySnapshot = await getDocs(q);
      const lessonsData = [];
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const subePromises = data.Subeler.map(async (sube) => {
          const result = await getDisplayNameFromUID({
            uid: sube.AkademisyenUID,
          });
          return { ...sube, AkademisyenAdi: result.data };
        });
        const subeler = await Promise.all(subePromises);
        lessonsData.push({ id: doc.id, data: { ...data, Subeler: subeler } });
      }
      setLessons(lessonsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-1">
      <table className="table table-dark table-striped text-center">
        <thead>
          <tr>
            <th>Ders Kodu</th>
            <th>Ders Adı</th>
            <th>Dersin Kredisi</th>
            <th>Şube No</th>
            <th>Akademisyen Adı</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson, lessonIndex) =>
            lesson.data.Subeler.map((sube, subeIndex) => (
              <tr key={`${lesson.id}-${subeIndex}`}>
                {subeIndex === 0 && (
                  <>
                    <td rowSpan={lesson.data.Subeler.length}>{lesson.id}</td>
                    <td rowSpan={lesson.data.Subeler.length}>
                      {lesson.data.DersAdi}
                    </td>
                    <td rowSpan={lesson.data.Subeler.length}>
                      {lesson.data.DersKredisi}
                    </td>
                  </>
                )}
                <td>{sube.SubeNo}</td>
                <td>{sube.AkademisyenAdi}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <button
        className="btn btn-primary p-3 container-fluid"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Yükleniyor..." : "Tüm Dersleri Getir"}
      </button>
      {loading && (
        <div className="text-center mt-3">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      )}
    </div>
  );
}
