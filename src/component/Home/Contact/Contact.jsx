import React, { useState, useEffect } from "react";
import { Col, Row, Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Contact.css";
import contactImg from "../../../Assets/contact.svg";

import Swal from "sweetalert2";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { generateVisitorId } from "./Utile";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticTimePicker } from "@mui/x-date-pickers/StaticTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { startOfDay, isBefore } from "date-fns";
import {
  collection,
  addDoc,
  serverTimestamp,
  query, where, onSnapshot,
} from "firebase/firestore";
import { db } from "../../Login/FirebaseAuth"
const Contact = () => {
  const [personConcerned, setPersonConcerned] = useState("");
  const [name, setName] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [numberTel, setNumberTel] = useState("");
  const [valeurSelectionnee, setValeurSelectionnee] = useState("");
  const [idnumber, setIdnumber] = useState("");
  const [objet, setObjet] = useState("");
  const [dateVisite, setDateVisite] = useState("");
  const [heureVisite, setHeureVisite] = useState(dayjs("2022-04-17T08:00"));
  const [matricule, setMatricule] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [existingDates, setExistingDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isDateSelected, setIsDateSelected] = useState(false);

  console.log("existingDates", existingDates)
  // Fonction pour ouvrir la modale
  const handleOpenModal = () => {
    setShowModal(true);
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleKeyPress = (event) => {
    const input = event.target;
    const value = input.value;
    const key = event.key;
    const isNumber = /^\d$/.test(key);

    if (isNumber && value.length >= 9) {
      event.preventDefault();
    }
  };

  

  // ...Limiter l'heure de la recepetion de service
  const handleTimeChange = (time) => {
    // Vérifier si l'heure sélectionnée est dans la plage autorisée (8h à 12h)
    const selectedHour = dayjs(time).hour();
    if (selectedHour >= 8 && selectedHour <= 12) {
      setHeureVisite(time);
    } else {
      Swal.fire({
        title: "Erreur !",
        text: "Le services est disponible de 8H vers 12h , merci de respecté cet intervale",
        icon: "error",
        confirmButtonText: "OK",
      }).then(() => {
        setHeureVisite(null);
      });
    }
  };
  // ...

  const formattedDate = dayjs(dateVisite).format("YYYY-MM-DD"); // Formate la date au format "YYYY-MM-DD"
  const formattedTime = dayjs(heureVisite).format("HH:mm"); // Formate l'heure au format "HH:mm"

  //  soumission de formulaire de demande d'un visiteur
  const onSubmit = async (e) => {
    e.preventDefault();

    const visitorId = generateVisitorId();

    const qrCodeData = {
      personConcerned,
      name,
      prenom,
      email,
      numberTel,
      valeurSelectionnee,
      idnumber,
      objet,
      dateVisite: formattedDate,
      heureVisite: formattedTime,
      matricule,
      timestamp: serverTimestamp(),
      visitorId: visitorId,
      isConfirmedService: false,
    };

    // // Chiffrer les données avec CryptoJS
    // const encryptedQrCodeData = CryptoJS.AES.encrypt(
    //   JSON.stringify(qrCodeData),
    //   'votre_clé_secrète'
    // ).toString();
    // // Supposez que vous avez récupéré les données chiffrées depuis Firebase et les avez stockées dans une variable appelée encryptedData
    // const encryptedData = encryptedQrCodeData // Remplacez ... par les données chiffrées récupérées depuis Firebase

    // // Déchiffrer les données avec CryptoJS en utilisant la même clé secrète
    // const bytes = CryptoJS.AES.decrypt(encryptedData, 'votre_clé_secrète');
    // const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    // console.log("decrypted Data", decryptedData);
    // const Data = {
    //   personConcerned,
    //   name,
    //   prenom,
    //   email,
    //   numberTel,
    //   valeurSelectionnee,
    //   idnumber,
    //   objet,
    //   dateVisite: formattedDate,
    //   heureVisite: formattedTime,
    //   matricule,
    //   timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    //   visitorId: visitorId,
    //   isConfirmedService: false,
    //   qrCodeData: encryptedQrCodeData
    // };

    // Envoyer les données chiffrées dans la base de données Firebase
    addDoc(collection(db, "visitor"), qrCodeData)
      .then(() => {
        console.log(
          "Données chiffrées enregistrées avec succès dans Firebase !"
        );
        Swal.fire({
          title: "Bravo !",
          text: "Parfait, votre demande sera traitée dans les meilleures conditions. Une réponse vous sera envoyée par e-mail.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error(
          "Erreur lors de l'enregistrement des données chiffrées :",
          error
        );
      });
  };

  useEffect(() => {
      // créez une requête Firestore pour récupérer les utilisateurs
      const q = query(collection(db, "visitor"), where("isConfirmedService", "==", true));

        // utilisez onSnapshot pour écouter les changements en temps réel de la collection
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const dates = querySnapshot.docs.map((doc) => doc.data().dateVisite);
      setExistingDates(dates);
    });
    return unsubscribe;
  
    // const firestore = firebase.firestore();
    // firestore
    //   .collection("visitor")
    //   .where("isConfirmedService", "==", true)
    //   .get()
    //   .then((querySnapshot) => {
    //     const dates = querySnapshot.docs.map((doc) => doc.data().dateVisite);
    //     setExistingDates(dates);
    //   })
    //   .catch((error) => {
    //     console.error(
    //       "Erreur lors de la récupération des demandes existantes :",
    //       error
    //     );
    //   });
  }, []);
  // ...

  // Fonction pour désactiver les dates déjà prises par d'autres visiteurs et les vendredis et samedis
  const isDateDisabled = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD"); // Formate la date au format "YYYY-MM-DD"

    // Vérifie si la date est un vendredi ou un samedi
    const isWeekendDay = () => {
      const dayOfWeek = new Date(date).getDay();
      return dayOfWeek === 5 || dayOfWeek === 6; // 5 pour vendredi, 6 pour samedi
    };

    // Vérifie si la date est avant aujourd'hui
    const isDateBeforeToday = () => {
      const today = startOfDay(new Date()); // Obtenir la date d'aujourd'hui à minuit
      return isBefore(date, today);
    };

    // Combine les deux conditions avec un OU logique
    return (
      isWeekendDay() ||
      existingDates.includes(formattedDate) ||
      isDateBeforeToday()
    );
  };

  // ...

  return (
    <section id="contact">
      <Col md={11} className="mx-auto">
        <Row>
          <Col md={6}>
            <form onSubmit={onSubmit} className="contactForm">
              <h4 className="miniTitle">Prenez un rendez-vous</h4>
              <h5 className="sectionTitle">En un seul clic</h5>
              <Row>
                <Col md={6} lg={6}>
                  <input
                    placeholder="Nom"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                  />
                </Col>
                <Col md={6} lg={6}>
                  <input
                    placeholder="Prénom"
                    type="text"
                    required
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="form-control"
                  />
                </Col>

                <Col md={12}>
                  <input
                    placeholder="Email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                  />
                </Col>
                <Col md={6} lg={6}>
                  <input
                    placeholder="Numéro de téléphone"
                    type="number"
                    required
                    value={numberTel}
                    onChange={(e) => setNumberTel(e.target.value)}
                    className="form-control"
                  />
                </Col>
                <Col md={6} lg={6}>
                  <input
                    placeholder="Numéro d'identité"
                    type="number"
                    required
                    value={idnumber}
                    onChange={(e) => setIdnumber(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="form-control"
                  />
                </Col>
                <Col
                  style={{
                    alignContent: "flex-start",
                    width: "100%",
                    maxWidth: "335px",
                  }}
                >
                  <label htmlFor="vehicleCheckbox" className="m-2">
                    J'ai un véhicule
                  </label>
                </Col>

                <Col md={12}>
                  <div className="form-control" style={{ display: "flex" }}>
                    <input
                      style={{ border: "0px" }}
                      type="number"
                      placeholder="Matricule de véhicule"
                      onKeyPress={handleKeyPress}
                      disabled={!isChecked}
                      value={matricule}
                      onChange={(e) => setMatricule(e.target.value)}
                    />

                    <input
                      style={{
                        borderRadius: "none",
                        border: "1px solid blue",
                        margin: "4% 0 0 2%",
                      }}
                      type="checkbox"
                      onChange={(e) => setIsChecked(e.target.checked)}
                      className="form-check-input"
                      id="vehicleCheckbox"
                    />
                  </div>
                </Col>
                <Col md={6} lg={6}>
                  <label className="m-2">Je suis ?</label>
                  <select
                    value={personConcerned}
                    onChange={(e) => setPersonConcerned(e.target.value)}
                    className="form-control"
                  >
                    <option value="visiteur Externe">Visiteur Externe</option>
                    <option value="visiteur Interne">Visiteur Interne</option>
                    <option value="visteur Normal">Visiteur Normal</option>
                    {/* Add more options as needed */}
                  </select>
                </Col>
                <Col md={6} lg={6}>
                  <label className=" m-2">Sélectionnez un service</label>
                  <select
                    value={valeurSelectionnee}
                    onChange={(e) => setValeurSelectionnee(e.target.value)}
                    className="form-control"
                  >
                    <option value="service général">Service général</option>
                    <option value="service d'hébergement">
                      Service d'hébergement
                    </option>
                    <option value="service de transport">
                      Service de transport
                    </option>
                  </select>
                </Col>
                <Col md={12} lg={12}>
                  {/* Bouton pour ouvrir la modale */}
                  <div onClick={handleOpenModal}>
                    <input
                      disabled
                      type="text"
                      value={
                        dateVisite && heureVisite
                          ? `le ${formattedDate} à ${formattedTime}`
                          : "Sélectionner la date et l'heure du rende-vous"
                      }
                      placeholder="Sélectionner la date et l'heure du rende-vous"
                      className="form-control bg-white  "
                      style={{cursor:"pointer"}}
                    />
                  </div>
                  {/* La modale */}
                  <Modal
                    show={showModal}
                    onHide={handleCloseModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                  >
                    <Modal.Header closeButton>
                      <Modal.Title>
                        Sélectionner une date et une heure
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Row>
                        <Col md={6} lg={6}>
                          {/* Utiliser le composant DayPicker de react-day-picker */}
                          <DayPicker
                            selected={dateVisite}
                            onDayClick={(day) => {
                              setDateVisite(day);
                              setIsDateSelected(true);
                            }}
                            // Utilisez la fonction isDateDisabled pour désactiver les dates déjà prises
                            modifiers={{
                              disabled: isDateDisabled,
                            }}
                          />
                        </Col>
                        <Col md={6} lg={6}>
                          {isDateSelected ? (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <StaticTimePicker
                                value={heureVisite}
                                onChange={handleTimeChange}
                                renderInput={(params) => (
                                  <input
                                    {...params}
                                    readOnly
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          ) : (
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <StaticTimePicker
                                disabled
                                value={heureVisite}
                                onChange={(time) => setHeureVisite(time)}
                                renderInput={(params) => (
                                  <input
                                    {...params}
                                    readOnly
                                    style={{ cursor: "pointer" }}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                          )}
                        </Col>
                      </Row>
                    </Modal.Body>
                    <Modal.Footer>
                      {/* Bouton pour fermer la modale */}
                      <Button onClick={handleCloseModal}>Fermer</Button>
                    </Modal.Footer>
                  </Modal>
                </Col>
                <Col md={12}>
                  <textarea
                    placeholder="Pourriez-vous nous expliquer davantage la raison de votre visite"
                    required
                    value={objet}
                    onChange={(e) => setObjet(e.target.value)}
                    className="form-control"
                  />
                </Col>
              </Row>
              <button className="branBtn" type="submit">
                Envoyer
              </button>
            </form>
          </Col>
          <Col md={6}>
            <img src={contactImg} alt="" className="img-fluid" />
          </Col>
        </Row>
      </Col>
    </section>
  );
};

export default Contact;
