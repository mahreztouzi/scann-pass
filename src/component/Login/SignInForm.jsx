import React from "react";
import { useForm } from "react-hook-form";
import { loginUser, db } from "./FirebaseAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, where, query } from "firebase/firestore";
import { logoutUser } from "./FirebaseAuth";
import Swal from "sweetalert2";
const SignInForm = ({ handleResponse }) => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async () => {
    loginUser(getValues("email"), getValues("password"))
      .then(async (userCredential) => {
        console.log(userCredential);
        console.log("connecté");

        const user = userCredential.user;
        if (user) {
          const q = query(
            collection(db, "Users"),
            where("email", "==", user.email),
            where("isConfirmed", "==", true)
          );

          getDocs(q)
            .then((querySnapshot) => {
              if (!querySnapshot.empty) {
                Swal.fire({
                  title: "Bravo!",
                  text: "Bienvenu",
                  icon: "success",
                  confirmButtonText: "OK",
                });
                navigate("/employee");
              } else {
                console.log("Compte non confirmé");
                logoutUser();
                Swal.fire({
                  title: "Oops",
                  text: "votre compte n'est pas confirmé par l'admin",
                  icon: "error",
                  confirmButtonText: "OK",
                });
                // Afficher un message d'erreur ou rediriger l'utilisateur vers une page de confirmation
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          console.log("Email ou mot de passe invalide");
          // Afficher un message d'erreur ou rediriger l'utilisateur vers une page de connexion
        }
      })
      .catch((error) => {
        console.log(error);
        console.log("Email ou mot de passe invalide");
        Swal.fire({
          title: "Oops",
          text: "Email ou mot de passe invalide",
          icon: "error",
          confirmButtonText: "OK",
        });
        // Afficher un message d'erreur ou rediriger l'utilisateur vers une page de connexion
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="sign-in-form">
      <h2 className="title">Connexion</h2>
      <div className="input-field">
        <span className="fIcon">
          <FontAwesomeIcon icon={faEnvelope} />
        </span>
        <input placeholder="Email" {...register("email", { required: true })} />
      </div>
      {errors.email && <span className="text-warning">Champ obligatoire</span>}
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
      <input className="iBtn" type="submit" value="Connexion" />
    </form>
  );
};

export default SignInForm;
