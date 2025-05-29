import { useState } from "react";
import "../style/Navbar.scss";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar navbar-expand-md ">
      <div className="header-title">
        <img className="icon" src="/images/Icon.png" alt="icon"></img>
        <a className="navbar-brand wttitle" href="#words">
          WordsTeacher
        </a>
      </div>
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
        <ul className="navbar-nav nav nav-tabs w-100 justify-content-around">
          <li className="nav-item">
            <a className="nav-link active" data-toggle="tab" href="#words">
              Words
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#addWords">
              Add Words
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#tests">
              Tests
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#dictionary">
              Dictionary
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" data-toggle="tab" href="#statistics">
              Statistics
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
