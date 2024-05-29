import { collection, getDocs } from "firebase/firestore";
import { db } from "../Modules/Firebase";
import { useState } from "react";

export default function ListStudentsLessons(props) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const lessonsRef = collection(db, "dersler");
      const lessonsSnapshot = await getDocs(lessonsRef);

      const filteredLessons = [];
      lessonsSnapshot.forEach((doc) => {
        const lessonData = doc.data();
        lessonData.Subeler.forEach((sube, index) => {
          if (sube.DersiAlanlar && sube.DersiAlanlar.includes(props.email)) {
            filteredLessons.push({
              id: doc.id,
              data: lessonData,
              subeNo: index + 1,
            });
          }
        });
      });

      setLessons(filteredLessons);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    if (!loading) {
      fetchData();
    }
  };

  return (
    <div className="container-fluid px-1">
      <button
        className="btn btn-primary p-3 container-fluid mb-3"
        onClick={handleButtonClick}
        disabled={loading}
      >
        {loading ? "Aldığım Dersleri Getiriliyor..." : "Aldığım Dersleri Getir"}
      </button>
      {loading && (
        <div className="spinner-container text-center">
          <div className="spinner text-white"></div>
        </div>
      )}
      {lessons.length > 0 && (
        <>
          <table className="table table-dark table-striped text-center">
            <thead>
              <tr>
                <th>Ders Kodu</th>
                <th>Ders Adı</th>
                <th>Dersin Kredisi</th>
                <th>Şube</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map((lesson) => {
                return (
                  <tr key={lesson.id}>
                    <td>{lesson.id}</td>
                    <td>{lesson.data.DersAdi}</td>
                    <td>{lesson.data.DersKredisi}</td>
                    <td>{`Şube ${lesson.subeNo}`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
