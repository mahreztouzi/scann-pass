import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../Login/FirebaseAuth";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import Container from "@mui/material/Container";

const SignalAgent = () => {
  const [reportData, setreportData] = useState([]);
  console.log("report data", reportData);

  // recueration des données singalées depuis bdd reports
  useEffect(() => {
    const reportQuery = query(collection(db, "reports"));

    const unsubscribe = onSnapshot(reportQuery, (querySnapshot) => {
      const reportList = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const signal = {
          id: doc.id,
          ...data,
        };
        reportList.push(signal);
      });

      setreportData(reportList);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="px-2">
      <CssBaseline />
      <Container>
        <Grid container spacing={3}>
          {reportData.map((signal) => (
            <Grid item xs={12} sm={6} md={4} key={signal.id}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
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
                  variant="body1"
                  sx={{
                    fontSize: "15px",
                    fontWeight: "400",
                    color: "#2150FC",
                    marginBottom: "5%",
                  }}
                >
                  <strong>Date de signalement :</strong>{" "}
                  {new Date(
                    signal.timestamp.seconds * 1000
                  ).toLocaleDateString()}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                    marginBottom: "2%",
                  }}
                >
                  <strong> Matricule :</strong>
                  {signal.immatriculation}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontSize: "16px",
                    fontWeight: "400",
                    fontFamily: "PT Serif",
                    width: "100%",
                    wordWrap: "break-word",
                  }}
                >
                  <strong> Description :</strong>
                  {signal.reportText}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default SignalAgent;
