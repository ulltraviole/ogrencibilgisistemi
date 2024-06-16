import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db, getUsers } from "../Modules/Firebase";
import Swal from "sweetalert2";

export default function BindLessonToStudent() {
  const [lessons, setLessons] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedLessonSubeler, setSelectedLessonSubeler] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const lessonsSnapshot = await getDocs(collection(db, "dersler"));
        const lessonsData = lessonsSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setLessons(lessonsData);

        const studentsData = await getUsers({ authLevel: "1" });
        setStudents(studentsData.data);

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLessonChange = (e) => {
    const lessonId = e.target.value;
    const lesson = lessons.find((lesson) => lesson.id === lessonId);
    setSelectedLesson(lesson);
    setSelectedLessonSubeler(lesson?.data.Subeler || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const getValue = (elName) => e.target.elements.namedItem(elName).value;

    const lessonId = getValue("lesson");
    const subeNo = getValue("sube");
    const email = getValue("email");

    const lessonRef = doc(db, "dersler", lessonId);
    const lessonSnapshot = await getDoc(lessonRef);
    const lessonData = lessonSnapshot.data();

    const isStudentAlreadyEnrolled = lessonData.Subeler.some(
      (sube) =>
        sube.DersiAlanlar &&
        sube.DersiAlanlar.some((da) => {
          return da.mail.includes(email);
        })
    );

    if (isStudentAlreadyEnrolled) {
      Swal.fire({
        icon: "warning",
        titleText: "Uyarı",
        text: "Öğrenci zaten bu derse kayıtlı.",
      });
      return;
    }

    const updatedSubeler = lessonData.Subeler.map((sube, index) => {
      if (index === subeNo - 1) {
        return {
          ...sube,
          DersiAlanlar: sube.DersiAlanlar
            ? [...sube.DersiAlanlar, { mail: email, devamsizlik: 0 }]
            : [{ mail: email, devamsizlik: 0 }],
        };
      }
      return sube;
    });

    try {
      await updateDoc(lessonRef, { Subeler: updatedSubeler });
      Swal.fire({
        icon: "success",
        titleText: "Başarılı",
        text: "Öğrenci ilgili derse başarıyla kaydedildi.",
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        titleText: "Hata",
        text: "Öğrenci derse kaydedilirken bir hata oluştu.",
      });
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

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
        {students.map((student) => (
          <option key={student.uid} value={student.email}>
            {student.email}
          </option>
        ))}
      </select>
      <label htmlFor="lesson">Ders Seçiniz</label>
      <select
        form="bindLessonToStudentForm"
        name="lesson"
        id="lesson"
        className="form-select mt-1 p-3"
        onChange={handleLessonChange}
        required
      >
        <option value="">Ders Seçiniz</option>
        {lessons.map((lesson) => (
          <option key={lesson.id} value={lesson.id}>
            {lesson.data.DersAdi}
          </option>
        ))}
      </select>
      {selectedLesson && (
        <>
          <label htmlFor="sube">Şube Seçiniz</label>
          <select
            form="bindLessonToStudentForm"
            name="sube"
            id="sube"
            className="form-select mt-1 p-3"
            required
          >
            <option value="">Şube Seçiniz</option>
            {selectedLessonSubeler.map((sube, index) => (
              <option key={sube.SubeNo} value={sube.SubeNo}>
                {`Şube ${sube.SubeNo}`}
              </option>
            ))}
          </select>
        </>
      )}
      <input
        type="submit"
        className="btn btn-primary p-3 mt-1 container-fluid"
        value={"Ders Ekle"}
      />
    </form>
  );
}
