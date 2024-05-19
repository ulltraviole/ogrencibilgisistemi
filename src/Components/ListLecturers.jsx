import { useState } from "react";
import { db, getUsers } from "../Modules/Firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ListLecturers() {
  const [lecturers, setLecturers] = useState([]);
  const handleClick = () => {
    getUsers({ authLevel: "2" })
      .then((lecturers) => {
        setLecturers([]);
        lecturers.data.forEach((lecturer) => {
          lecturer.VerdigiDersler = [];
          const q = query(
            collection(db, "dersler"),
            where("AkademisyenUID", "==", lecturer.uid)
          );
          getDocs(q)
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                lecturer.VerdigiDersler.push(doc.data().DersAdi);
              });
              setLecturers((lecturers) => [...lecturers, lecturer]);
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
      <table className="table table-striped text-center">
        <thead>
          <tr>
            <th>Adı Soyadı</th>
            <th>E-Posta Adresi</th>
            <th>Verdiği Dersler</th>
          </tr>
        </thead>
        <tbody>
          {lecturers.map((lecturer) => {
            return (
              <tr key={lecturer.uid}>
                <td>{lecturer.displayName}</td>
                <td>{lecturer.email}</td>
                <td>
                  {lecturer.VerdigiDersler.map((ders, index) => {
                    return ` ${index + 1}.) ${ders}`;
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="btn btn-primary container-fluid" onClick={handleClick}>
        Tüm Akademisyenleri Getir
      </button>
    </div>
  );
}
