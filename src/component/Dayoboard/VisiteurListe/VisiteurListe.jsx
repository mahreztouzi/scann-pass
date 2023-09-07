import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import { db } from "../../Login/FirebaseAuth";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";

const VisiteurListe = () => {
  const [visitor, setVisitor] = useState([]);
  const today = new Date().toISOString().split('T')[0]; // Get today's date in "YYYY-MM-DD" format

  console.log("visiteur", visitor)

  useEffect(() => {
    const q = query(
      collection(db, "visitor"),
      where("isConfirmedService", "==", true)
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


  // Find the user with today's date in dateVisite
  const todayVisitor = visitor.find((user) => user.dateVisite === today);



  return (
    <div className="px-2" style={{height:"auto"}}>
      <Container>
        <Grid container spacing={1}>
        <Grid item xs={12} sm={12} md={12} >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                marginTop: "1%",
                marginBottom: "1%",
          
              }}
            >
             
              {todayVisitor ? (
                <div style={{   backgroundColor:"#FFA85A", width:"70%",height:"100%",  padding: "8px",  borderRadius: "15px", boxShadow: "0 0 10px rgba(0,0,0,0.2)",display:"flex",justifyContent:"space-between", alignContent:"center"}}>
                <div>
                <Typography
                variant="h5"
                sx={{
                  fontSize: "20px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                }}
              >
                <strong>Nom et prenom :</strong> { todayVisitor.name } {" "} { todayVisitor.prenom}
              </Typography>
             
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      fontFamily: "PT Serif",
                      width: "100%",
                      wordWrap: "break-word",
                      color: "#2E5EB8",
                    }}
                  >
                    <strong> Date et l'heure du rendez-vous :</strong>{" "}
                    {new Date(todayVisitor.dateVisite).toLocaleDateString()} à{" "}
                    {todayVisitor.heureVisite}
                  </Typography>
                  <Typography
                    sx={{
                      width: "100%",
                      fontSize: "14px",
                      fontWeight: "400",
                    }}
                  >
                    <strong>Date de la demande :</strong>{" "}
                    {todayVisitor.timestamp?.seconds
                      ? new Date(
                          todayVisitor.timestamp.seconds * 1000
                        ).toLocaleDateString()
                      : ""}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      fontFamily: "PT Serif",
                      width: "100%",
                      wordWrap: "break-word",
                    }}
                  >
                    <strong>Email :</strong> {todayVisitor.email}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "14px",
                      fontWeight: "400",
                      fontFamily: "PT Serif",
                      width: "100%",
                      wordWrap: "break-word",
                    }}
                  >
                    <strong>Véhicule :</strong> {todayVisitor.matricule ? todayVisitor.matricule : "sans véhicule"}
                  </Typography>
                </div>
                <img src={todayVisitor.imgUrl} style={{width:"28%", borderRadius:"10px",boxShadow:"0 0 10px #555"}} alt="photoVisitor" />
                </div>
              ) : (
                <Typography sx={{color:"#CA6308", fontSize:"22px", fontWeight:"600"}}>Aucun visiteur pour aujourd'hui.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
        <Grid>
          <hr style={{width:"60%", margin:"auto", border:"1px solid black", marginBottom:"1%"}} />
        </Grid>
        <div style={{ height: "400px", width:"100%",padding:"10px", overflow: "auto"}}>
        <Grid container spacing={3}>
          {visitor.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%",
                  margin: "1%",
                  backgroundColor: "#FAFAFA",
                  borderRadius: "15px",
                  boxShadow: "0 0 10px rgba(0,0,0,0.2)",
                  padding: "20px",
               
                }}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontSize: "20px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    marginBottom: "5%",
                  }}
                >
                  <strong>Nom :</strong> {user.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                    color: "#2150FC",
                  }}
                >
                  <strong> Date et l'heure du rendez-vous :</strong>{" "}
                  {new Date(user.dateVisite).toLocaleDateString()} à{" "}
                  {user.heureVisite}
                </Typography>
                <Typography
                  sx={{
                    width: "100%",
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  <strong>Date de la demande :</strong>{" "}
                  {user.timestamp?.seconds
                    ? new Date(
                      user.timestamp.seconds * 1000
                    ).toLocaleDateString()
                    : ""}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong>Email :</strong> {user.email}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "14px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong>Véhicule :</strong> {user.matricule ? user.matricule : "sans vehicule"}
                </Typography>

              </Box>
            </Grid>
          ))}
        </Grid>
        </div>
      
      </Container>
    </div>
  );
};

export default VisiteurListe;
