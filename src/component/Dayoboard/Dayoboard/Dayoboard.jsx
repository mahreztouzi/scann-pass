import React, { useState } from "react";
import { Link } from "react-router-dom";

import Sidebare from "../Sidebare/Sidebare";
import "./Dayoboard.css";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ServiceDayoboard from "../ServiceDayoboard/ServiceDayoboard";

const Dayoboard = () => {
  const [sideToggle, setSideToggle] = useState(false);
  const [title, setTitle] = useState("Service");

  return (
    <div id="dayoboard">
      <div id="sidebare" className={sideToggle ? "active" : ""}>
        <div className="sidebarContent">
          <Sidebare setTitle={setTitle} />
          <div className="backBtnBox">
            <Link to="/">
              <button
                className="backBtn"
                onClick={() => {
                  localStorage.removeItem("isAuthenticated");
                }}
              >
                <FontAwesomeIcon
                  icon={faSignOutAlt}
                  style={{
                    marginRight: "10px",
                  }}
                />
                Deconnexion
              </button>
            </Link>
          </div>
        </div>
      </div>
      <div id="pageContent">
        <div className="dashBoardHeader">
          <div className="d-flex align-items-center">
            <div
              id="nav-icon"
              className={sideToggle ? "menu-btn" : "menu-btn open"}
              onClick={() => setSideToggle(!sideToggle)}
            >
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <h3>{title}</h3>
          </div>
        </div>
        {/* {admin ? <AdminDashboard /> : <UserDashboard />} */}
        {/* <AdminDashboard /> */}
        <ServiceDayoboard />
      </div>
    </div>
  );
};

export default Dayoboard;
