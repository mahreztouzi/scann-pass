import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { signupUser } from "./FirebaseAuth";
import { doc, setDoc, Timestamp, GeoPoint } from "firebase/firestore";
import { db } from "./FirebaseAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faEnvelope,
  faLock,
  faUser,
  faKey,
  faCar,
} from "@fortawesome/free-solid-svg-icons";

import Swal from "sweetalert2";

// import { sendEmailVerification } from "firebase/auth";
// import { auth } from "../Login/FirebaseAuth"
const SignUpForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const onSubmit = () => {
    console.log(getValues());
    //inscription et enregistrement vers la Bdd
    console.log(getValues("email"));
    signupUser(getValues("email"), getValues("password"))
      .then(async (result) => {
        console.log(result);
        const geopoint = new GeoPoint(0, 0);
        const infouser = {
          userId: result.user.uid,
          name: getValues("name"),
          lastName:getValues("lastName"),
          email: getValues("email"),
          secretCode: getValues("secretCode"),
          immatricule: isChecked
            ? getValues("immatricule") || "valeur par défaut"
            : "pas de voiture",
          isConfirmed: false,
          isMission: false,
          location: geopoint,
          createdAt: Timestamp.fromDate(new Date()),
          password: getValues("password"),
        };

        await setDoc(doc(db, "Users", infouser.userId), infouser)
          .then(() => {
            Swal.fire({
              title: "Bravo!",
              text: "Parfait ! l'admin va confirmer votre compte au plus vite possible",
              icon: "success",
              confirmButtonText: "OK",
            }).then(() => {
              window.location.reload();
            });
          })
        
          .catch((error) => {
            console.log(error.message);
          });
      })
      .catch((err) => {
        console.log(err);
        console.log(err.message);
        alert("email-already-in-use");
      });

  };
  function handleKeyPress(event) {
    const input = event.target;
    const value = input.value;
    const key = event.key;
    const isNumber = /^\d$/.test(key);

    if (isNumber && value.length >= 9) {
      event.preventDefault();
    }
  }

  const [isChecked, setIsChecked] = useState(false);

  function handleCheckboxChange(event) {
    setIsChecked(event.target.checked);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sign-up-form">
      <h2 className="title">Inscription</h2>
      <div className="input-field">
        <span className="fIcon">
          <FontAwesomeIcon icon={faUser} />
        </span>
       <div style={{display:'flex', flexDirection:"row"}}>
       <input
          placeholder="Nom"
          {...register("name", { required: true })}
        />
          <input
          placeholder="Prenom"
          {...register("lastName", { required: true })}
        />
       </div>
      </div>
      <div className="input-field">
        <span className="fIcon">
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
        <input
          placeholder="Email"
          type="email"
          {...register("email", { required: true })}
        />
      </div>

      <div className="input-field">
        <span className="fIcon">
          <FontAwesomeIcon icon={faKey} />
        </span>
        <input
          placeholder="Code secret "
          type="number"
          {...register("secretCode", { required: true })}
        />
      </div>
      <div
        className="check"
        style={{
          alignContent: "flex-start",
          width: "100%",
          maxWidth: "335px",
        }}
      >
        <input type="checkbox" onChange={handleCheckboxChange} />
        <span
          style={{
            color: "#aaa",
            fontWeight: "700",
            fontSize: "20px",
          }}
        >
          J'ai un véhicule
        </span>
      </div>

      <div className="input-field">
        <span className="fIcon">
          <FontAwesomeIcon icon={faCar} />
        </span>
        <input
          type="number"
          placeholder="Matricule de véhicule"
          onKeyPress={handleKeyPress}
          disabled={!isChecked}
          {...register("immatricule")}
        />
      </div>
      <div className="input-field">
        <span className="fIcon">
          <FontAwesomeIcon icon={faLock} />
        </span>
        <input
          type="password"
          placeholder="Mot de passe"
          {...register("password", { required: true })}
        />
      </div>
      <div className="input-field">
        <span className="fIcon">
          <FontAwesomeIcon icon={faLock} />
        </span>
        <input
          type="password"
          placeholder="Confirmez votre mot de passe"
          {...register("passwordConfirmation", {
            required: true,
            validate: (value) =>
              value === getValues("password") ||
              "Les mots de passe ne correspondent pas",
          })}
        />
      </div>
      {errors.passwordConfirmation && (
        <span className="text-warning">
          {errors.passwordConfirmation.message}
        </span>
      )}
      {/* <input className="iBtn" type="submit" value="Inscription" /> */}
      <button className="iBtn" type="submit">
        Inscription
      </button>

      {/* <p className="social-text">Or Sign up with social account</p>
            <SocialMedia handleResponse={handleResponse}/> */}
    </form>
  );
};

export default SignUpForm;
