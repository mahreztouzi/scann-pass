import React from "react";
import teamPic from "../../../Assets/about.svg";
import Fade from "react-reveal/Fade";

const About = () => {
  return (
    <section className="about overflow-hidden py-5">
      <div className="row w-100">
        <div className="row col-md-11 mx-auto ">
          <div className="col-md-6 img">
            <Fade duration={2000} left>
              <img src={`${teamPic}`} alt="" className="img-fluid" />
            </Fade>
          </div>
          <div className="col-md-6 ps-2">
            <Fade duration={2000} right>
              <p className="miniTitle">À PROPOS DE SCAN PASS</p>
              <h1 className="headerTitle" style={{ fontSize: "30px" }}>
                COMMENT NOUS POUVONS AIDER VOTRE ENTREPRISE À{" "}
                <span className="headerHighlight"> GÉRER LES ACCÈS</span> DE SES
                EMPLOYÉS
              </h1>
              <p className="headerContent">
                Chez Scan Pass, notre objectif est de simplifier la gestion des
                accès de vos employés. Nous avons développé une application web
                qui génère des codes QR uniques pour chaque employé, permettant
                ainsi de reconnaître facilement et rapidement les employés
                autorisés à accéder à vos locaux. Nous offrons une solution
                simple, pratique et efficace pour aider votre entreprise à
                améliorer la sécurité, la rapidité et l'efficacité de vos
                processus d'accès. Faites confiance à notre expertise pour vous
                aider à gérer facilement les accès de vos employés.
              </p>
              <button className="branBtn">learn More</button>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
