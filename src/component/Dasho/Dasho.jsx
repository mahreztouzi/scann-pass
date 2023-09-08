import React, { useState, useEffect } from "react";
import QrReader from "react-qr-reader";
import "./StyleDasho.css";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, getDownloadURL } from "firebase/storage";
import { db, storage } from "../Login/FirebaseAuth";
import Swal from "sweetalert2";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import userimg from "../../Assets/user.svg";


const AgentInterface = () => {
  const [visitor, setVisitor] = useState([]);
  const [users, setUsers] = useState([]);
  const [stopScan, setStopScan] = useState(true);
  const [immatriculation, setImmatriculation] = useState("");

  //  tester les données de code Qr avec les données visiteur ou employee
  const handleScan = async (data) => {
    if (data) {

      setStopScan(false);
      
      // Comparer les données du code QR avec les données des visiteurs
      if (visitor || users) {
        const matchedVisitor = visitor.find(
          (visitor) => visitor.visitorId === data
        );
        if (matchedVisitor) {
          const today = new Date();
          const dateVisite = new Date(matchedVisitor.dateVisite);

          if (dateVisite.toDateString() === today.toDateString()) {
            // La date de visite correspond à aujourd'hui
            console.log("Visiteur trouvé:", matchedVisitor);
            Swal.fire({
              title: "Autorisée !",
              html: `Bienvenue <b> monsieur :</b> ${matchedVisitor.name}, <b> vehicule :</b>  ${matchedVisitor.matricule ? matchedVisitor.matricule : "sans vehicule"
                } ``<b>Partenaire :</b> ${matchedVisitor.partenaire !== 'visiteur seule' ? `Nom  : ${matchedVisitor.partenaire[0]}, identité : ${matchedVisitor.partenaire[1]}` : `${matchedVisitor.partenaire}`}`,
              icon: "success",
              imageUrl: `${matchedVisitor.imgUrl && matchedVisitor.imgUrl}`,
              imageHeight: 180,
              imageAlt: 'imgVisiteur',

              confirmButtonText: "OK",
              footer: `<b>VISITEUR &nbsp; </b>  ${matchedVisitor.personConcerned
                ? matchedVisitor.personConcerned
                : "  visiteur externe"
                }`,
            }).then(() => {
              setStopScan(true);
            });
          } else {
            // La date de visite ne correspond pas à aujourd'hui
            const formattedDateVisite = dateVisite.toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            Swal.fire({
              title: "Rendez-vous non accessible",
              text: `Le rendez-vous est accessible le ${formattedDateVisite}`,
              icon: "warning",
              confirmButtonText: "OK",
            }).then(() => {
              setStopScan(true);
            });
          }
        } else {
          const matchedUser = users.find((user) => user.userId === data);
          if (matchedUser) {
           const imgUrl= await fetchImgEmploye(matchedUser.userId);
            // Faites ce que vous voulez avec le visiteur correspondant trouvé
            console.log("user trouvé:", matchedUser);
            Swal.fire({
              title: "Autorisé !",
              html: `Bienvenue <b> monsieur :</b> ${matchedUser.name
                }, <b> vehicule :</b>  ${matchedUser.immatricule
                  ? matchedUser.immatricule
                  : "sans vehicule"
                } `,
              imageUrl: `${imgUrl ? imgUrl : userimg}`,
              imageHeight: 180,
              imageAlt: 'imgVisiteur',
              icon: "success",
              confirmButtonText: "OK",
              footer: `<b>EMPLOYEE</b> `,
            }).then(() => {
              setStopScan(true);
            });
          } else {
            console.log("Visiteur ou user non trouvé dans la base de données.");
            Swal.fire({
              title: "N est pas Autorisé !",
              text: "QR code invalide ",
              icon: "error",
              confirmButtonText: "OK",
            }).then(() => {
              setStopScan(true);
            });
          }
        }
      }
    }
  };
  const handleError = (error) => {
    console.error("Erreur lors de la lecture du code QR:", error);
  };

  //  recuperation des utilisateurs de la base de donnée vistiteur et employeee
  useEffect(() => {
    const visitorQuery = query(
      collection(db, "visitor"),
      where("isConfirmedService", "==", true)
    );

    const unsubscribeVisitor = onSnapshot(visitorQuery, (querySnapshot) => {
      const visitorList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const user = {
          id: doc.id,
          ...data,
        };
        visitorList.push(user);
      });

      setVisitor(visitorList);
    });
    // Récupérer les utilisateurs confirmés depuis Firestore (nouvelle collection "Users")
    const usersQuery = query(
      collection(db, "Users"),
      where("isConfirmed", "==", true)
    );
    const unsubscribeUsers = onSnapshot(usersQuery, (querySnapshot) => {
      const userList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const user = {
          id: doc.id,
          ...data,
        };
        userList.push(user);
      });
      setUsers(userList);
    });

    return () => {
      unsubscribeVisitor();
      unsubscribeUsers();
    };
  }, []);

  //  identification d'un véhicule
  const handleSearchVehicule = (e) => {
    e.preventDefault();
    if (immatriculation === "") {
      Swal.fire({
        title: "Données invalide !",
        text: "Veuillez taper l'immatriculation svp ! ",
        icon: "error",
        confirmButtonText: "OK",
      });
    } else {
      if (visitor || users) {
        const matchedVisitorMatricule = visitor.find(
          (visitor) => visitor.matricule === immatriculation
        );
        if (matchedVisitorMatricule) {
          // Faites ce que vous voulez avec le visiteur correspondant trouvé
          console.log("Visiteur trouvé:", matchedVisitorMatricule);
          Swal.fire({
            title: "Autorisée !",
            html: ` <b> vehicule de monsieur : </b>  ${matchedVisitorMatricule.name} `,
            icon: "success",
            confirmButtonText: "OK",
            footer: `<b>VISITEUR : </b>  ${matchedVisitorMatricule.personConcerned
              ? matchedVisitorMatricule.personConcerned
              : "visiteur externe"
              }`,
          });
        } else {
          const matchedUserMatricule = users.find(
            (user) => user.immatricule === immatriculation
          );
          if (matchedUserMatricule) {
            // Faites ce que vous voulez avec le visiteur correspondant trouvé
            console.log("user trouvé:", matchedUserMatricule);
            Swal.fire({
              title: "Autorisé !",
              html: ` <b> vehicule de monsieur : </b>  ${matchedUserMatricule.name} `,
              icon: "success",
              confirmButtonText: "OK",
              footer: `<b>EMPLOYEE</b> `,
            });
          } else {
            console.log("Visiteur ou user non trouvé dans la base de données.");
            Swal.fire({
              title: "N'est pas Autorisé !",
              text: "Matricule introuvable dans la base de données",
              icon: "error",
              confirmButtonText: "Signaler",
              showCancelButton: true,
              cancelButtonText: "Annuler",
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: "Signaler un véhicule non identifiable",
                  input: "textarea",
                  inputAttributes: {
                    autocapitalize: "off",
                  },
                  showCancelButton: true,
                  confirmButtonText: "Envoyer",
                  cancelButtonText: "Annuler",
                  preConfirm: (reportText) => {
                    // Envoyer les informations du signalement à la base de données Firebase
                    return addReportToDatabase(reportText);
                  },
                  allowOutsideClick: () => !Swal.isLoading(),
                }).then((result) => {
                  if (result.isConfirmed) {
                    Swal.fire({
                      title: "Signalement envoyé avec succès !",
                      text: "Le véhicule a été signalé avec succès.",
                      icon: "success",
                      confirmButtonText: "OK",
                    });
                  }
                });
              }
            });
          }
        }
      }
    }
    setImmatriculation("");
  };
  // envoyer le signaelment a la base de données reports
  const addReportToDatabase = async (reportText) => {
    // Vous pouvez utiliser les informations du signalement pour enregistrer dans la base de données
    try {
      const signalData = {
        reportText,
        immatriculation,
        timestamp: serverTimestamp(),
      };

      // Par exemple, si vous avez une collection "reports" dans votre base de données Firebase :
      await addDoc(collection(db, "reports"), signalData);
      return true; // Retourner true pour indiquer que le signalement a réussi
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du signalement :", error);
      Swal.showValidationMessage(
        `Erreur lors de l'enregistrement du signalement : ${error.message}`
      );
      return false; // Retourner false pour indiquer que le signalement a échoué
    }
  };

  const fetchImgEmploye = async (visitorId) => {
    try {
      const imgUserRef = ref(storage, `userImg/${visitorId}.jpeg`);
      const imgUser = await getDownloadURL(imgUserRef);
      return imgUser;
    } catch (error) {
      console.error("Erreur lors de la récupération du code QR :", error);

    }
  };
  return (
    <Col md={5} className="mx-auto">
      <div className="profile">
        <h2> Agent</h2>
        <div className="profileInfo">
          <h4
            style={{
              paddingBottom: "3px",
            }}
          >
            Scanner code Qr
          </h4>
          <div
            style={{
              margin: "0 auto",
              width: "300px",
              height: "300px",
            }}
          >
            {stopScan && (
              <QrReader
                className="qr-scanner"
                delay={300}
                onError={handleError}
                onScan={handleScan}
                facingMode="environment"
                style={{
                  width: "300px",
                  height: "300px",
                  margin: "0 auto",
                  boxShadow: " 0 2px 5px 3px rgba(48, 46, 49, 0.39)",
                }}
              />
            )}
          </div>
          <h4
            style={{
              margin: "20px 0 10px 0",
            }}
          >
            Identifier un véhicule
          </h4>
          <div>
            <input
              required
              type="number"
              placeholder="Taper l'immatriculation  "
              className="input-search-identification"
              value={immatriculation}
              onChange={(e) => setImmatriculation(e.target.value)}
            />
            <button className="searchBtn" onClick={handleSearchVehicule}>
              chercher
            </button>
          </div>
          <Link to="/">
            <button
              className="mainBtn mt-4"
              onClick={() => {
                localStorage.removeItem("isAuthenticated");
              }}
            >
              déconnexion
            </button>
          </Link>
        </div>
      </div>
    </Col>
  );
};

export default AgentInterface;
