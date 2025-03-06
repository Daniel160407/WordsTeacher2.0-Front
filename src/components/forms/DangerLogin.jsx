import axios from "axios";
import { useState } from "react";
import "../../style/forms/DangerLogin.scss";

const DangerLogin = ({ setDeletingPermission }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginSubmit = (e) => {
    e.preventDefault();

    const user = {
      email,
      password,
    };
    axios
      .put("http://localhost:8080/login", user)
      .then((response) => {
        if (response.status === 202) {
          setDeletingPermission(true);
        } else {
          setDeletingPermission(false);
        }
      })
      .catch(() => {
        alert("Incorrect email or password!");
      });
  };

  return (
    <div className="dangerLogin">
      <form id="loginForm" onSubmit={handleLoginSubmit}>
      <h3>Please enter email and password to delete an account</h3>
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