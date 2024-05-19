import { collection, query, getDocs } from "firebase/firestore";
import { db, getDisplayNameFromUID } from "../Modules/Firebase";
import { useState } from "react";

export default function ListLessons() {
  const [lessons, setLessons] = useState([]);
  const handleClick = () => {
    const q = query(collection(db, "dersler"));
    getDocs(q)
      .then((querySnapshot) => {
        setLessons([]);
        querySnapshot.forEach((doc, index) => {
          let data = doc.data();
          getDisplayNameFromUID({
            uid: data.AkademisyenUID,
          }).then((result) => {
            data.AkademisyenAdi = result.data;
            setLessons((lessons) => [...lessons, { id: doc.id, data: data }]);
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
            <th>Ders Kodu</th>
            <th>Ders Adı</th>
            <th>Dersin Kredisi</th>
            <th>Akademisyen Adı</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => {
            return (
              <tr key={lesson.id}>
                <td>{lesson.id}</td>
                <td>{lesson.data.DersAdi}</td>
                <td>{lesson.data.DersKredisi}</td>
                <td>{lesson.data.AkademisyenAdi}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button className="btn btn-primary container-fluid" onClick={handleClick}>
        Tüm Dersleri Getir
      </button>
    </div>
  );
}
