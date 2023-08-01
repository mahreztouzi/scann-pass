import React from "react";
import { NavLink } from "react-router-dom";
import "./Sidebare.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faList } from "@fortawesome/free-solid-svg-icons";
import { faBuffer } from "@fortawesome/free-brands-svg-icons";

const Sidebare = ({ setTitle }) => {
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
            {/* <li>
              <NavLink
                onClick={() => setTitle("Listes des employés")}
                activeclassname="activePage"
                to="/dashboard/employeeList"
              >
                <FontAwesomeIcon icon={faList} className="iconC" />
                List des employés
              </NavLink>
            </li> */}
            <li>
              <NavLink
                onClick={() => setTitle("Listes des visiteur")}
                activeclassname="activePage"
                to="/dayoboard/visiteurListe"
              >
                <FontAwesomeIcon icon={faList} className="iconCs" />
                List des visiteur
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => setTitle("Demande de vesite")}
                activeclassname="activePage"
                to="/dayoboard/addVisiteur"
              >
                <FontAwesomeIcon icon={faUserPlus} className="iconCs" />
                Demande de vesite
              </NavLink>
            </li>
          </>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebare;
