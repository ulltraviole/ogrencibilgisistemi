import { useEffect, useState } from "react";
import { deleteUser, getUsers } from "../Modules/Firebase";
import Swal from "sweetalert2";

export default function DeleteStudent() {
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = () => {
    setLoading(true);
    getUsers({ authLevel: "1" })
      .then((students) => {
        setStudents(students.data);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        Swal.fire({
          icon: "error",
          titleText: "Hata",
          text: "Öğrenciler getirilirken bir hata oluştu.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const studentEmail = e.target.elements.email.value;
    const student = students.find((student) => student.email === studentEmail);

    try {
      await deleteUser({ email: studentEmail });
      Swal.fire({
        icon: "success",
        titleText: "Başarılı",
        text: `${student.displayName} adlı öğrenci ve ilgili ders kayıtları başarıyla silindi.`,
      });
      loadStudents(); // Öğrenci silindikten sonra listeyi güncelle
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        titleText: "Hata",
        text: "Öğrenci silinirken bir hata oluştu.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && (
        <div className="d-flex justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {!loading && (
        <form
          id="deleteStudentForm"
          onSubmit={handleSubmit}
          className="container-fluid px-1 p-3"
        >
          <label htmlFor="email">
            Kaydını silmek istediğiniz öğrenciyi seçiniz.
          </label>
          <select className="form-control p-3" name="email" id="email" required>
            <option value="">Öğrenci Seçiniz</option>
            {students.map((student) => (
              <option key={student.uid} value={student.email}>
                {student.email}
              </option>
            ))}
          </select>
          <input
            type="submit"
            className="btn btn-primary p-3 mt-1 container-fluid"
            value={"Öğrenciyi Sil"}
          />
        </form>
      )}
    </div>
  );
}
