// import Swal from "sweetalert2";

import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, getUsers } from "../Modules/Firebase";
import Swal from "sweetalert2";

export default function BindLessonToStudent() {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    getDocs(query(collection(db, "dersler")))
      .then((querySnapshot) => {
        setLessons([]);
        querySnapshot.forEach((doc) => {
          setLessons((lessons) => [
            ...lessons,
            { id: doc.id, data: doc.data() },
          ]);
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  useEffect(() => {
    getUsers({ authLevel: "1" }).then((students) => {
      setStudents([]);
      students.data.forEach((student) => {
        setStudents((students) => [...students, student]);
      });
    });
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    function getValue(elName) {
      return e.target.elements.namedItem(elName).value;
    }
    //TODO: İlgili maile sahip öğrenci sistemde var mı kontrol edilsin.
    const docRef = doc(db, "dersler", getValue("lesson"));
    updateDoc(docRef, { DersiAlanlar: arrayUnion(getValue("email")) })
      .then(() => {
        Swal.fire({
          icon: "success",
          titleText: "Başarılı",
          text: "Öğrenci ilgili derse başarıyla kaydedildi.",
        });
      })
      .catch((err) => {
        console.err(err);
      });
  };

  return (
    <form
      id="bindLessonToStudentForm"
      onSubmit={handleSubmit}
      className="container-fluid px-1 p-3"
    >
      <label htmlFor="email">
        Derse kaydetmek istediğiniz öğrenciyi seçiniz.
      </label>
      <select className="form-control p-3" name="email" id="email" required>
        {students.map((student) => {
          return (
            <option key={student.uid} value={student.email}>
              {student.email}
            </option>
          );
        })}
      </select>
      <label htmlFor="lesson">Ders Seçiniz</label>
      <select
        form="bindLessonToStudentForm"
        name="lesson"
        id="lesson"
        className="form-select mt-1 p-3"
      >
        {lessons.map((lesson) => {
          return (
            <option key={lesson.id} value={lesson.id}>
              {lesson.data.DersAdi}
            </option>
          );
        })}
      </select>
      <input
        type="submit"
        className="btn btn-primary p-3 mt-1 container-fluid"
        value={"Ders Ekle"}
      />
    </form>
  );
}
