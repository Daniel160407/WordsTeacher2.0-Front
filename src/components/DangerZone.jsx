import Cookies from "js-cookie";
import "../style/DangerZone.scss";
import { useEffect, useState } from "react";
import DangerLogin from "./forms/DangerLogin";
import getAxiosInstance from "./util/GetAxiosInstance";

const DangerZone = () => {
  const [loadLogInForm, setLoadLogInForm] = useState(false);
  const [deletingPermission, setDeletingPermission] = useState(false);

  useEffect(() => {
    if (deletingPermission) {
      getAxiosInstance(`/login?userid=${Cookies.get("userId")}`, "delete")
        .then((response) => {
          if (response?.status === 200) {
            Cookies.remove("languageId");
            Cookies.remove("plan");
            Cookies.remove("token");
            Cookies.remove("userId");
            window.location.reload();
          }
        })
        .catch((error) => {
          console.error("Error deleting account:", error);
        });
    }
  }, [deletingPermission]);

  const handleLogout = () => {
    Cookies.remove("languageId");
    Cookies.remove("plan");
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("languageLevel");
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

export default DangerZone;
