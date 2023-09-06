import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../Login/FirebaseAuth";
import { ref, getDownloadURL, uploadBytes, getStorage } from "firebase/storage";
import QRCode from "qrcode";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import emailjs from "@emailjs/browser";
import Container from "@mui/material/Container";

const AddVisiteur = () => {
  const [visitor, setVisitor] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "visitor"),
      where("isConfirmedService", "==", false)
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
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

    return unsubscribe;
  }, []);

  //  Function pour confirmer un utilisteur en lui generant un urlde code QR et ensuite faire appelle a la fonction send mail pour envoyer un email automatiue
  const confirmUser = async (visitorId, visitorEmail, userName) => {
    const userRef = doc(db, "visitor", visitorId);

    try {
      await updateDoc(userRef, {
        isConfirmedService: true,
      });

      // Generate and store the QR code
      await generateAndStoreQRCode(visitorId);

      // Get the QR code URL after it's generated and stored
      const qrCodeURL = await fetchQRCode(visitorId);

      // Send the email with the QR code URL
      await sendEmail(visitorEmail, qrCodeURL, userName);

      console.log("Utilisateur confirmé avec succès et email envoyé.");
    } catch (error) {
      console.error("Erreur lors de la confirmation de l'utilisateur", error);
    }
  };

  // Function to delete a visitor
  const deleteVisitor = (visitorId, visitorEmail, userName) => {
    sendEmailDemandRefused(visitorEmail, userName);
    const userRef = doc(db, "visitor", visitorId);

    deleteDoc(userRef)
      .then(() => {
        console.log("Utilisateur supprimé avec succès");
      })
      .catch((error) => {
        console.error("Erreur lors de la suppression de l'utilisateur", error);
      });
  };

  const generateAndStoreQRCode = async (visitorId) => {
    const user = visitor.find((user) => user.id === visitorId);

    if (user) {
      // Vérifier si le code QR pour ce visiteur existe déjà dans Firebase Storage
      const qrCodeRef = ref(storage, `qrCodes/${user.id}.png`);
      try {
        // Récupérer l'URL de téléchargement du code QR
        const qrCodeURL = await getDownloadURL(qrCodeRef);
        console.log("Code QR existe déjà:", qrCodeURL);
      } catch (error) {
        // Si le code QR n'existe pas encore, générer le contenu du code QR à partir des informations du visiteur
        const qrCodeContent = user.visitorId;

        try {
          // Générer le code QR sous forme de base64
          const qrCodeBase64 = await QRCode.toDataURL(qrCodeContent);

          // Convertir le base64 en blob
          const response = await fetch(qrCodeBase64);
          const blob = await response.blob();

          // Stocker le blob dans Firebase Storage avec un nom unique basé sur l'ID du visiteur
          const storageRef = ref(storage, `qrCodes/${user.id}.png`);
          await uploadBytes(storageRef, blob);

          console.log("Code QR généré et stocké avec succès");
        } catch (error) {
          console.error(
            "Erreur lors de la génération et du stockage du code QR",
            error
          );
        }
      }
    }
  };

  const fetchQRCode = async (visitorId) => {
    try {
      const storage = getStorage();
      const qrCodeRef = ref(storage, `qrCodes/${visitorId}.png`);
      const qrCodeURL = await getDownloadURL(qrCodeRef);
      return qrCodeURL;
    } catch (error) {
      console.error("Erreur lors de la récupération du code QR :", error);
      return null;
    }
  };

  // useEffect(() => {
  //   // Récupérer les URL des codes QR pour chaque visiteur
  //   const getQRCodeURLs = async () => {
  //     const qrCodeURLsObj = {};
  //     for (const user of visitor) {
  //       const qrCodeURL = await fetchQRCode(user.id);
  //       qrCodeURLsObj[user.id] = qrCodeURL;
  //     }
  //   };
  //   getQRCodeURLs();
  // }, [visitor]);

  // l'envoi de l'email
  const sendEmail = (visitorEmail, qrCodeImageURL, userName) => {
    // Vérifiez que l'adresse email du destinataire n'est pas vide
    if (!visitorEmail) {
      console.error("Adresse e-mail du destinataire vide.");
      return;
    }

    const templateParams = {
      to_email: visitorEmail, // Spécifiez l'adresse email du destinataire
      qrCodeImageURL: qrCodeImageURL, // Utilisez l'URL réelle du code QR
      name: userName,
    };
    console.log("qr code ", qrCodeImageURL);

    emailjs
      .send(
        "service_7lrsvgj",
        "template_gyghzfa",
        templateParams,
        "aJoYDi0Gsn4m3LYHL"
      )
      .then((response) => {
        console.log("E-mail envoyé avec succès", response);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
      });
  };
  const sendEmailDemandRefused = (visitorEmail, userName) => {
    // Vérifiez que l'adresse email du destinataire n'est pas vide
    if (!visitorEmail) {
      console.error("Adresse e-mail du destinataire vide.");
      return;
    }

    const templateParams = {
      to_email: visitorEmail, // Spécifiez l'adresse email du destinataire
      name: userName,
    };

    emailjs
      .send(
        "service_7lrsvgj",
        "template_b1zlel5",
        templateParams,
        "aJoYDi0Gsn4m3LYHL"
      )
      .then((response) => {
        console.log("E-mail envoyé avec succès", response);
      })
      .catch((error) => {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
      });
  };
 
  return (
    <div className="px-2">
      <Container>
        <Grid container spacing={3}>
          {visitor.map((user) => (
            <Grid item xs={12} sm={6} md={6} key={user.id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  marginTop: "5%",
                  marginBottom: "5%",
                  backgroundColor: "#FAFAFA",
                  borderRadius: "15px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  padding: "4%",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    marginBottom: "3%",
                  }}
                >
                  <strong> Nom et prenom :</strong> {user.name} {user.prenom}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong> Date de la demande :</strong>{" "}
                  {new Date(user.timestamp.seconds * 1000).toLocaleDateString()}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong> Date et l'heure du rendez-vous :</strong>{" "}
                  {new Date(user.dateVisite).toLocaleDateString()} à{" "}
                  {user.heureVisite}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong> numero de carte d'identité :</strong> {user.idnumber}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong> numero de telephone : </strong> {user.numberTel}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong> Email :</strong> {user.email}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong> Véhicule :</strong>{" "}
                  {user.matricule ? user.matricule : "sans vehicule"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong> Type de visiteurs:</strong>{" "}
                  {user.personConcerned
                    ? user.personConcerned
                    : " Visiteur externe"}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                 
                  {user.partenaire
                    ? ( <div>
                       <strong> Partenaire :</strong>  oui  <br/>
                       <strong> Nom du partenaire :</strong>  {user.partenaire[0]} <br/>
                       <strong> Identité du Partenaire :</strong>  {user.partenaire[1]}

                    </div>  ) 
                    :  ( <div>
                      <strong> Partenaire :</strong>  non  <br/>
                      <strong> Nom du partenaire : /</strong>   <br/>
                       <strong> Identité du Partenaire : /</strong>  

                   </div>  ) }
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                    marginTop: "3%",
                    marginBottom: "5%",
                    maxWidth: "400px",
                    height: "100px",
                    maxHeight: "100px",
                    overflow: "auto",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "18px",
                      fontWeight: "900",
                      fontFamily: "PT Serif",
                    }}
                  >
                    Objet de la demande :
                  </strong>{" "}
                  {user.objet}
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                  <Button
                    variant="contained"
                    sx={{
                      margin: "3px",
                      borderRadius: "15px",
                      backgroundColor: "#7355F7",
                      fontSize: "13px",
                    }}
                    onClick={() => confirmUser(user.id, user.email, user.name)}
                  >
                    Valider
                  </Button>

                  <Button
                    variant="contained"
                    sx={{
                      margin: "3px",
                      borderRadius: "15px",
                      backgroundColor: "#FF0000",
                      fontSize: "13px",
                    }}
                    onClick={() =>
                      deleteVisitor(user.id, user.email, user.name)
                    }
                  >
                    Supprimer
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default AddVisiteur;
