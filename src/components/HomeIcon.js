import React from "react";
import { Link } from "react-router-dom";
import "../css/HomeIcon.css";

const HomeIcon = () => {
  return (
    <div className="home-icon-container">
      <Link to="/MainPage">
        <img src="/img/homeicon.png" alt="homeicon" className="home-icon" />
      </Link>
    </div>
  );
};

export default HomeIcon;
