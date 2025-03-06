import Cookies from "js-cookie";
import "../style/DangerZone.scss";
import axios from "axios";
import { useEffect, useState } from "react";
import DangerLogin from "./forms/DangerLogin";

const Logout = () => {
  const [loadLogInForm, setLoadLogInForm] = useState(false);
  const [deletingPermission, setDeletingPermission] = useState(false);

  useEffect(() => {
    if (deletingPermission) {
      axios
        .delete(`http://localhost:8080/login?userid=${Cookies.get("userId")}`, {
          headers: {
            Authorization: `${Cookies.get("token") || ""}`,
          },
        })
        .then((response) => {
          if (response?.status === 200) {
            Cookies.remove("languageId");
            Cookies.remove("plan");
            Cookies.remove("token");
            Cookies.remove("userId");
            window.location.reload();
          }
        });
    }
  }, [deletingPermission]);

  const handleLogout = () => {
    Cookies.remove("languageId");
    Cookies.remove("plan");
    Cookies.remove("token");
    Cookies.remove("userId");
    window.location.reload();
  };

  const handleDelete = () => {
    setLoadLogInForm(true);
  };

  return (
    <div className="dengerZone">
      <button className="btn-danger dangerbtn" onClick={handleLogout}>
        Log out
      </button>
      <button className="btn-danger dangerbtn" onClick={handleDelete}>
        Delete Account
      </button>
      {loadLogInForm && (
        <DangerLogin setDeletingPermission={setDeletingPermission} />
      )}
    </div>
  );
};

export default Logout;
