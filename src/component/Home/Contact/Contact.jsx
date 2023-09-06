import React, { useState, useEffect, useRef, useCallback } from "react";
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
  query, onSnapshot,
} from "firebase/firestore";
import { db } from "../../Login/FirebaseAuth"
import emailjs from "@emailjs/browser";
import Webcam from "react-webcam";


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
  const [partenairName, setPartenairName] = useState("");
  const [partenairIdentité, setPartenairIdentité] = useState();
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [showModalPhoto, setShowModalPhoto] = useState(true)


  console.log("existingDates", existingDates)
  // Fonction pour ouvrir la modale
  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleOpenModalPhoto = () => {
    setShowModalPhoto(true);
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCloseModalPhoto = () => {
    setShowModalPhoto(false);
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

    // Vérifiez si la date est vide
    if (!dateVisite) {
      Swal.fire({
        title: "Erreur de date",
        text: "Veuillez sélectionner une date de visite.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Arrêtez la soumission du formulaire si la date est vide
    }

    const visitorId = generateVisitorId();

    // Générez le code de vérification
    const generatedCode = generateVerificationCode();

    // Envoie de l'email de confirmation avec le code
    try {
      await sendConfirmationEmail(email, generatedCode, name);
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'e-mail de confirmation :", error);
      Swal.fire({
        title: "Erreur d'envoi d'e-mail",
        text: "Une erreur s'est produite lors de l'envoi de l'e-mail de confirmation. Veuillez réessayer plus tard.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return; // Arrêtez le reste du traitement si l'e-mail n'a pas pu être envoyé.
    }


    // Attendez la réponse de l'utilisateur (utilisation de SweetAlert)

    await Swal.fire({
      title: 'Confirmation de l\'email',
      html: `Un email de vérification est envoyé à cet addresse : <b>${email} </b>, pour continuer vous devez confirmer votre addresse email`,
      input: 'number',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      allowOutsideClick: false,
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
      preConfirm: (verificationCode) => {
        // Convertir verificationCode en nombre
        verificationCode = +verificationCode;
        // Vérifiez si le code saisi correspond au code généré
        if (verificationCode === +generatedCode) {
          return true; // La saisie est correcte
        } else {
          Swal.showValidationMessage('Code de vérification incorrect');
          return false; // La saisie est incorrecte
        }
      },

    }).then((result) => {
      if (result.isConfirmed) {
        const partenaire = partenairName || partenairIdentité ? [partenairName, partenairIdentité] : "visiteur seule";
        const qrCodeData = {
          partenaire,
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



        // Envoyer les données chiffrées dans la base de données Firebase
        addDoc(collection(db, "visitor"), qrCodeData)
          .then(() => {
            console.log(
              "Données chiffrées enregistrées avec succès dans Firebase !"
            );
            Swal.fire({
              title: "Bravo !",
              text: "Parfait, e-mail confirmé et votre demande sera traitée dans les meilleures conditions. Une réponse vous sera envoyée par e-mail.",
              icon: "success",
              confirmButtonText: "OK",
            })
          })
          .catch((error) => {
            console.error(
              "Erreur lors de l'enregistrement des données chiffrées :",
              error
            );
          });
        setPersonConcerned("")
        setName("")
        setPrenom("")
        setEmail("")
        setNumberTel("")
        setValeurSelectionnee("")
        setIdnumber("")
        setObjet("")
        setDateVisite("")
        setHeureVisite("")
        setMatricule("")

      }
    });



  };

  useEffect(() => {
    // créez une requête Firestore pour récupérer les utilisateurs
    const q = query(collection(db, "visitor"));

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


  // generation d'un chiffre aleatoire 
  function generateVerificationCode() {
    return Math.floor(1000 + Math.random() * 9000); // Génère un nombre aléatoire à 4 chiffres
  }
  // fin de la genration de chiffres aleratoier



  // l'envoi de l'email de confirmation d'email
  const sendConfirmationEmail = (visitorEmail, message, userName) => {
    // Vérifiez que l'adresse email du destinataire n'est pas vide
    if (!visitorEmail) {
      console.error("Adresse e-mail du destinataire vide.");
      return;
    }

    const templateParams = {
      to_email: visitorEmail, // Spécifiez l'adresse email du destinataire
      message: message, // Utilisez l'URL réelle du code QR
      to_name: userName,
    };


    emailjs
      .send(
        "service_eqhx6ge",
        "template_th26x9o",
        templateParams,
        "3F92AqhIWky_PI7-9"
      )
      .then((response) => {
        console.log("E-mail envoyé avec succès", response);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
      });
  };
  // .. fin email confirmation

  const handleAcoompagne = () => {
    Swal.fire({
      title: 'Accompagné ?',
      text: 'Le jour de votre rendez-vous vous êtes accompagné ?',
      icon: 'warning',
      allowOutsideClick: false,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Entrer les informations de votre partenaire',
          allowOutsideClick: false,
          html:

            '<input id="swal-input1" type="text" class="swal2-input" placeholder="Nom complet" required>' +
            '<input id="swal-input2" type="number" class="swal2-input" placeholder="Numéro d\'identité" required>',
          inputAttributes: {
            autocapitalize: 'off',
          },
          showCancelButton: true,
          confirmButtonText: 'Confirmer',
          cancelButtonText: "Annuler",
          showLoaderOnConfirm: true,
          preConfirm: () => {
            const nomComplet = document.getElementById('swal-input1').value;
            const numeroIdentite = document.getElementById('swal-input2').value;

            if (!nomComplet || !numeroIdentite) {
              Swal.showValidationMessage('Veuillez remplir tous les champs obligatoires.');
            }
            return [
              setPartenairName(document.getElementById('swal-input1').value),
              setPartenairIdentité(document.getElementById('swal-input2').value)
            ]
          }
        });
      }
    });
  };
  // ...

  // *** prendre une photo ***


  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);
  // *** fin prendre photo
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

                  <select
                    value={personConcerned}

                    onChange={(e) => {
                      setPersonConcerned(e.target.value)
                      if (e.target.value === "visiteur Externe" || e.target.value === "visiteur Interne") {
                        handleAcoompagne();
                      }
                    }}
                    className="form-control mt-2 p-3"
                  >
                    <option>Je suis ?</option>
                    <option value="visiteur Externe" style={{ fontWeight: "bold" }} >Visiteur Externe</option>
                    <option value="visiteur Interne" style={{ fontWeight: "bold" }} >Visiteur Interne</option>
                  </select>
                </Col>

                <Col md={6} lg={6}>

                  <select
                    value={valeurSelectionnee}
                    onChange={(e) => setValeurSelectionnee(e.target.value)}
                    className="form-control mt-2 p-3"
                  >
                    <option > Sélectionnez un service ?</option>
                    <option value="service général" style={{ fontWeight: "bold" }}>Service général</option>
                    <option value="service d'hébergement" style={{ fontWeight: "bold" }}>
                      Service d'hébergement
                    </option>
                    <option value="service de transport" style={{ fontWeight: "bold" }}>
                      Service de transport
                    </option>
                  </select>
                </Col>
                <Col md={12} lg={12}>
                  {/* Bouton pour ouvrir la modale */}
                  <div onClick={handleOpenModal}>
                    {/* <input
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
                    /> */}
                    <span className="form-control bg-white " style={{ cursor: "pointer", padding: "1rem", marginTop: "1rem" }}>
                      {
                        dateVisite && heureVisite
                          ? `le ${formattedDate} à ${formattedTime}`
                          : "Sélectionner la date et l'heure du rende-vous"
                      }
                    </span>
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
                  {/* modal capture de photo */}
                  <Modal
                    show={showModalPhoto}
                    onHide={handleCloseModalPhoto}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered

                  >
                    <Modal.Header closeButton>
                      <Modal.Title>
                        Prendre une photo
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body style={{textAlign:"center"}}>

                      {imgSrc ? (
                      <>
                        <img
                            style={{ width: "100%", height: "300px" }}
                          src={imgSrc}
                          alt="img"
                        />
                         <Button onClick={()=>{setImgSrc(null)}} className="btn-secondary mt-3">Prendre une autre photo</Button>
                      </>
                      ) : (<>
                      <Webcam
                        style={{ width: "100%", height: "300px",   borderRadius:"" }}
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                      />
                      <Button onClick={capture} className="btn-success mt-3 ">Capture photo</Button>
                      </>
                      )}
                    </Modal.Body>
                    <Modal.Footer>
                      {/* Bouton pour fermer la modale */}
                      <Button onClick={handleCloseModalPhoto} className="btn-primary">Confirmer</Button>
                    </Modal.Footer>
                  </Modal>
                  {/* fin modal de capture de photo */}
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
