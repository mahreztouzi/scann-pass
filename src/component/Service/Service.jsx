import Swal from "sweetalert2";
import * as React from "react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import bgImage from "../../Assets/bg.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

function SignIn({ onLogin }) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const onSubmit = () => {
    if (
      getValues("email") === "service@gmail.com" &&
      getValues("password") === "Service"
    ) {
      Swal.fire({
        icon: "success",
        title: "Connexion service",
        text: "Bienvenu au espace service",
      });
      onLogin();
      navigate("/dayoboard");
    } else {
      Swal.fire({
        icon: "error",
        title: "Ops...",
        text: "Email ou mot de passe eroné",
      });
    }
  };

  return (
    <div
      style={{
        widht: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${bgImage}) `,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right",
        overflow: "hidden",
      }}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sign-in-form"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          margin: "10% auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "50px",
          boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          width: "40%",
          background: "white",
        }}
      >
        <h2 className="title">Sign in</h2>
        <div className="input-field">
          <span className="fIcon">
            <FontAwesomeIcon icon={faEnvelope} />
          </span>
          <input
            placeholder="Email"
            {...register("email", { required: true })}
          />
        </div>
        {errors.email && (
          <span className="text-warning">Champ obligatoire</span>
        )}
        <div className="input-field">
          <span className="fIcon">
            <FontAwesomeIcon icon={faLock} />
          </span>
          <input
            type="password"
            placeholder="Password"
            {...register("password", { required: true })}
          />
        </div>
        {errors.password && (
          <span className="text-warning">Champ obligatoire</span>
        )}
        <input className="iBtn" type="submit" value="sign In" />
      </form>
    </div>
  );
}

const Service = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", true);
  };

  return (
    <>
      <SignIn onLogin={handleLogin} />
    </>
  );
};

export default Service;
