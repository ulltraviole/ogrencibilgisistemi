import { collection, query, getDocs, where } from "firebase/firestore";
import { db } from "../Modules/Firebase";
import { useState } from "react";

export default function ListStudentsLessons(props) {
  const [lessons, setLessons] = useState([]);
  const handleClick = () => {
    const q = query(
      collection(db, "dersler"),
      where("DersiAlanlar", "array-contains", props.email)
    );
    getDocs(q)
      .then((querySnapshot) => {
        setLessons([]);
        querySnapshot.forEach((doc) => {
          let data = doc.data();
          setLessons((lessons) => [...lessons, { id: doc.id, data: data }]);
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
            <th>Ders Kodu</th>
            <th>Ders Adı</th>
            <th>Dersin Kredisi</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => {
            return (
              <tr key={lesson.id}>
                <td>{lesson.id}</td>
                <td>{lesson.data.DersAdi}</td>
                <td>{lesson.data.DersKredisi}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        className="btn btn-primary p-3 container-fluid"
        onClick={handleClick}
      >
        Aldığım Dersleri Getir
      </button>
    </div>
  );
}
