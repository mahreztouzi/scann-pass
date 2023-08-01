import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Login/FirebaseAuth";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";

const AddEmployee = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    // créez une requête Firestore pour récupérer les utilisateurs non confirmés
    const q = query(collection(db, "Users"), where("isConfirmed", "==", false));

    // utilisez onSnapshot pour écouter les changements en temps réel de la collection
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userList = [];

      // bouclez sur chaque document de la collection pour récupérer les données
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

    return unsubscribe;
  }, []);
  const confirmUser = (userId) => {
    const userRef = doc(db, "Users", userId);

    updateDoc(userRef, {
      isConfirmed: true,
    })
      .then(() => {
        console.log("Utilisateur confirmé avec succès");
      })
      .catch((error) => {
        console.error("Erreur lors de la confirmation de l'utilisateur", error);
      });
  };

  return (
    <div className="px-2">
      <Grid
        container
        className="scrollGrid"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          height: "60vh",
          overflow: "auto",
          padding: "1%",
        }}
      >
        {users.map((user) => (
          <Grid className="noteContainer" xs={12} sm={6} md={4} key={user.id}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginTop: "5%",
                marginButtom: "5%",
                backgroundColor: "#F6F1E9",
                borderRadius: "15px",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
              }}
            >
              <Typography
                id="keep-mounted-modal-title"
                sx={{
                  fontSize: "20px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                <strong> Nom :</strong>
                {user.name}
              </Typography>

              <Typography
                id="keep-mounted-modal-title"
                sx={{
                  fontSize: "15px",
                  fontWeight: "400",
                  color: "#2150FC",
                }}
              >
                <strong> Date d'inscripiton :</strong>
                {new Date(user.createdAt.seconds * 1000).toLocaleDateString()}
              </Typography>
              <Typography
                id="keep-mounted-modal-title"
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  fontFamily: "PT Serif",
                  width: "100%",
                  wordWrap: "break-word",
                  textAlign: "center",
                }}
              >
                <strong> Email :</strong>
                {user.email}
              </Typography>
              <Typography
                id="keep-mounted-modal-title"
                sx={{
                  fontSize: "14px",
                  fontWeight: "400",
                  fontFamily: "PT Serif",
                  width: "100%",
                  wordWrap: "break-word",
                  textAlign: "center",
                }}
              >
                <strong> Véhicule :</strong> {user.immatricule}
              </Typography>
              <Button
                variant="contained"
                sx={{
                  margin: "3px",
                  borderRadius: "15px",
                  backgroundColor: "#7355F7",
                  fontSize: "13px",
                }}
                onClick={() => confirmUser(user.id)}
              >
                Valider
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AddEmployee;
