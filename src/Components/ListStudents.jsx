import { useState } from "react";
import { db, getUsers } from "../Modules/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ListStudents() {
  const [students, setStudents] = useState([]);
  const handleClick = () => {
    getUsers({ authLevel: "1" })
      .then((students) => {
        setStudents([]);
        students.data.forEach((student) => {
          student.AldigiDersler = [];

          const q = query(
            collection(db, "dersler"),
            where("DersiAlanlar", "array-contains", student.email)
          );
          getDocs(q)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                student.AldigiDersler.push(doc.data().DersAdi);
              });
              setStudents((students) => [...students, student]);
            })
            .catch((err) => {
              throw err;
            });
        });
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <div className="container-fluid px-1">
      <table className="table table-dark table-striped text-center">
        <thead>
          <tr>
            <th>Adı Soyadı</th>
            <th>E-Posta Adresi</th>
            <th>Aldığı Dersler</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => {
            return (
              <tr key={student.uid}>
                <td>{student.displayName}</td>
                <td>{student.email}</td>
                <td>
                  {student.AldigiDersler.map((ders, index) => {
                    return ` ${index + 1}.) ${ders}`;
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="btn btn-primary p-3 container-fluid" onClick={handleClick}>
        Tüm Öğrencileri Getir
      </button>
    </div>
  );
}
