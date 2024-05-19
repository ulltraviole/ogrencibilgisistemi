import { useOutletContext } from "react-router-dom";

// Yönetici Componentleri

import CreateLesson from "../Components/CreateLesson";
import ListLessons from "../Components/ListLessons";
import SetAuthLevel from "../Components/SetAuthLevel";
import CreateUser from "../Components/CreateUser";
import ListLecturers from "../Components/ListLecturers";

// Akademisyen Componentleri

import ListStudents from "../Components/ListStudents";
import BindLessonToStudent from "../Components/BindLessonToStudent";
import ListLecturersLessons from "../Components/ListLecturersLessons";

// Öğrenci Componentleri

import ListStudentsLessons from "../Components/ListStudentsLessons";

export default function Dashboard() {
  const [authLevel, user] = useOutletContext();
  switch (authLevel) {
    case "3":
      return (
        <div className="container-fluid">
          <div className="d-flex mx-auto">
            <ListLecturers />
          </div>
          <div className="d-flex mx-auto">
            <ListLessons />
          </div>
          <div className="d-flex mx-auto">
            <CreateUser />
            <CreateLesson />
          </div>
          <div className="d-flex mx-auto">
            <SetAuthLevel />
          </div>
        </div>
      );
    case "2":
      return (
        <div className="container-fluid">
          <div className="d-flex mx-auto">
            <ListStudents />
          </div>
          <div className="d-flex mx-auto">
            <ListLecturersLessons uid={user.uid} />
          </div>
          <div className="d-flex mx-auto">
            <BindLessonToStudent />
          </div>
        </div>
      );
    case "1":
      return (
        <div className="container-fluid">
          <div className="d-flex mx-auto">
            <ListStudentsLessons email={user.email} />
          </div>
        </div>
      );
    default:
      return "Loading...";
  }
}
