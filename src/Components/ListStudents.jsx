import { useState } from "react";
import { db, getUsers } from "../Modules/Firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ListStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const studentsData = await getUsers({ authLevel: "1" });

      const studentsWithCourses = await Promise.all(
        studentsData.data.map(async (student) => {
          const q = collection(db, "dersler");
          const querySnapshot = await getDocs(q);
          const courses = [];

          querySnapshot.forEach((doc) => {
            const subeler = doc.data().Subeler || [];
            subeler.forEach((sube, index) => {
              if (
                sube.DersiAlanlar &&
                sube.DersiAlanlar.includes(student.email)
              ) {
                courses.push({
                  dersAdi: doc.data().DersAdi,
                  subeNo: index + 1,
                });
              }
            });
          });

          return { ...student, AldigiDersler: courses };
        })
      );

      setStudents(studentsWithCourses);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid px-1">
      {loading && (
        <div className="d-flex justify-content-center my-3">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && (
        <>
          <table className="table table-dark table-striped text-center">
            <thead>
              <tr>
                <th>Adı Soyadı</th>
                <th>E-Posta Adresi</th>
                <th>Aldığı Dersler</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.uid}>
                  <td>{student.displayName}</td>
                  <td>{student.email}</td>
                  <td>
                    <ul>
                      {student.AldigiDersler.map((ders, index) => (
                        <li key={index}>
                          {ders.dersAdi} (Şube {ders.subeNo})
                        </li>
                      ))}
                    </ul>
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
            Tüm Öğrencileri Getir
          </button>
        </>
      )}
    </div>
  );
}
