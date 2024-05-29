import { useState } from "react";
import { getUsers } from "../Modules/Firebase";
import ListLecturersLessons from "./ListLecturersLessons";

export default function ListLecturers() {
  const [loading, setLoading] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const lecturersData = await getUsers({ authLevel: "2" });

      const lecturers = await Promise.all(
        lecturersData.data.map(async (lecturer) => {
          try {
            return { ...lecturer };
          } catch (error) {
            console.error(error);
          }
        })
      );

      setLecturers(lecturers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-1">
      <table className="table table-dark table-striped text-center">
        <thead>
          <tr>
            <th>Adı Soyadı</th>
            <th>E-Posta Adresi</th>
            <th>Dersleri Görüntüle</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.map((lecturer) => (
            <tr key={lecturer.uid}>
              <td>{lecturer.displayName}</td>
              <td>{lecturer.email}</td>
              <td>
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelectedLecturer(lecturer)}
                >
                  Dersleri Gör
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn btn-primary p-3 container-fluid mb-3"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? "Yükleniyor..." : "Tüm Akademisyenleri Getir"}
      </button>
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Yükleniyor...</span>
          </div>
        </div>
      )}
      {selectedLecturer && <ListLecturersLessons lecturer={selectedLecturer} />}
    </div>
  );
}
