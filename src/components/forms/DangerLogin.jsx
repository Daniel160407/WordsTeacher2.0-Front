import { useState } from "react";
import getAxiosInstance from "../util/GetAxiosInstance";
import "../../style/forms/DangerLogin.scss";

const DangerLogin = ({ setDeletingPermission }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await getAxiosInstance(`/login`, "put", {
        email,
        password,
      });

      setDeletingPermission(response.status === 202);
    } catch (error) {
      alert("Incorrect email or password!");
    }
  };

  return (
    <div className="dangerLogin">
      <form id="loginForm" onSubmit={handleLoginSubmit}>
        <h3>Your entire data will be lost, if you are sure with your actions please enter email and password to delete an account</h3>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <button type="submit" className="deleteSubmitBtn">
          Delete Account
        </button>
      </form>
    </div>
  );
};

export default DangerLogin;
