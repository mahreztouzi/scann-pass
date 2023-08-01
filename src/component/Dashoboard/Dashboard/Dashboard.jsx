import React, { useState } from "react";
import { Link } from "react-router-dom";

import AdminDashboard from "../AdminDashboard/AdminDashboard";
import Sidebar from "../Sidebar/Sidebar";
import "./Dashboard.css";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Dashboard = () => {
  const [sideToggle, setSideToggle] = useState(false);
  const [title, setTitle] = useState("Admin");

  return (
    <div id="dashboard">
      <div id="sidebar" className={sideToggle ? "active" : ""}>
        <div className="sidebarContent">
          <Sidebar setTitle={setTitle} />
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
        <AdminDashboard />
      </div>
    </div>
  );
};

export default Dashboard;
