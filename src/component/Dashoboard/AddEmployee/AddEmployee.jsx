import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../Login/FirebaseAuth";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import { Typography } from "@mui/material";

import Button from "@mui/material/Button";

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
                backgroundColor: "#FAFAFA",
                borderRadius: "15px",
                boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                padding: "4%",
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
                  fontSize: "20px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                <strong> Prenom :</strong>
                {user.lastName}
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
