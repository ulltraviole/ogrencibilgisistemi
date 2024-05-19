import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/dashboard");
  };
  return (
    <div
      style={{ height: "100vh" }}
      className="d-flex justify-content-center align-items-center w-100 h-max bg-dark"
    >
      <button className="container btn btn-success w-25" onClick={handleClick}>
        Giriş yapmak için tıklayınız.
      </button>
    </div>
  );
}
