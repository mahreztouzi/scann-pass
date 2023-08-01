import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserPlus,
  faList,
  faExclamationTriangle,
  faSuitcase,
} from "@fortawesome/free-solid-svg-icons";
import { faBuffer } from "@fortawesome/free-brands-svg-icons";

const Sidebar = ({ setTitle }) => {
  return (
    <div>
      <div className="sideBrand">
        <div className="sideBrnIcon">
          <FontAwesomeIcon icon={faBuffer} />
        </div>
        <h2>
          Scann <span className="navHighlight">Pass</span>
        </h2>
      </div>
      <nav id="sideNavbars">
        <ul>
          {/* <li>
            <NavLink
              onClick={() => setTitle("Profile")}
              activeclassname="activePage"
              exact
              to="/dashboard/profile"
            >
              <FontAwesomeIcon icon={faUserCircle} className="iconC" />
              Profile
            </NavLink>
          </li> */}

          <>
            <li>
              <NavLink
                onClick={() => setTitle("Listes des employés")}
                activeclassname="activePage"
                to="/dashboard/employeeList"
              >
                <FontAwesomeIcon icon={faList} className="iconCs" />
                List des employés
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setTitle("Confirmation employee")}
                activeclassname="activePage"
                to="/dashboard/addEmployee"
              >
                <FontAwesomeIcon icon={faUserPlus} className="iconCs" />
                Confirmation employee
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setTitle("Signalement de sécurité")}
                activeclassname="activePage"
                to="/dashboard/signal"
              >
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="iconCs"
                />
                Signalement de sécurité
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setTitle("Employes en mission")}
                activeclassname="activePage"
                to="/dashboard/mission"
              >
                <FontAwesomeIcon icon={faSuitcase} className="iconCs" />
                Employes en mission
              </NavLink>
            </li>
          </>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
