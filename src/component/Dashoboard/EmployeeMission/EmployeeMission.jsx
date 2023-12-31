import React, { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../Login/FirebaseAuth";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function EmployeeMission() {
  const [users, setUsers] = useState([]);
  const [map, setMap] = useState(null); // État pour stocker l'instance de la carte
  const [ummtoMarker, setUmmtoMarker] = useState(null);
  
  useEffect(() => {
    // Récupérer les utilisateurs confirmés depuis Firestore (nouvelle collection "Users")
    const usersQuery = query(
      collection(db, "Users"),
      where("isMission", "==", true)
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
      unsubscribeUsers();
    };
  }, []);

  useEffect(() => {
    // Créez une carte Leaflet lorsque les utilisateurs sont disponibles
    if (!map) {
      const newMap = L.map("map").setView([36.7039, 4.0482], 17);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        newMap
      );

      const ummtoIcon = L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/3033/3033337.png", // URL de l'icône personnalisée
        iconSize: [55, 60], // Définissez la taille de l'icône (largeur, hauteur) en pixels
        iconAnchor: [16, 32], // Définissez l'ancre de l'icône (point central bas) en pixels
        popupAnchor: [0, -32], // Définissez l'ancre du popup (point supérieur gauche) en pixels
      });

      // Ajoutez le marqueur avec l'icône personnalisée sur la carte
      const marker = L.marker([36.7039, 4.0482], {
        icon: ummtoIcon,
      }).addTo(newMap);

      marker.bindPopup("<b>Université Mouloud Mammeri Hassnoua</b>").openPopup();

      setUmmtoMarker(marker);
      setMap(newMap); // Stocker l'instance de la carte dans l'état
    }

    // Supprimer les marqueurs existants de la carte
    map?.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== ummtoMarker) {
        map.removeLayer(layer);
      }
    });

    // Ajouter des marqueurs à la carte pour chaque utilisateur
    users.forEach((user) => {
      const customIcon = L.icon({
        iconUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Map_pin_icon_green.svg/800px-Map_pin_icon_green.svg.png",
        iconSize: [50, 64],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
      });

      const marker = L.marker(
        [user.location.latitude, user.location.longitude],
        { icon: customIcon }
      )
        .bindPopup(`<b>${user.name}</b>`)
        .openPopup()

        .addTo(map);

      // Ajouter un gestionnaire d'événement pour déplacer la carte vers le marqueur lorsqu'il est cliqué
      marker.on("click", () => {
        map.setView([user.location.latitude, user.location.longitude], 15);
      });
    });
  }, [ummtoMarker, map, users]);

  const handleUserClick = (user) => {
    map.setView([user.location.latitude, user.location.longitude], 15);
  };



console.log("les utilisateur", users)
  return (
    <div style={{ marginLeft: "2%" }}>
      <Grid
        container
        className="scrollGrid"
        rowSpacing={1}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        sx={{
          height: "80vh",

          padding: "2%",
        }}
      >
        <Grid
          item
          xs={12}
          sm={4}
          md={4}
          sx={{
            backgroundColor: "#FAFAFA",
            borderRadius: "15px",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            padding: "1%",
            height: "98%",
          }}
        >
          <Typography
            id="keep-mounted-modal-title"
            sx={{
              fontSize: "16px",
              fontWeight: "800",
              textTransform: "uppercase",
              margin: "10px 0 15px 5px",
            }}
          >
            <strong> List des employee en mission : </strong>
          </Typography>
          <Grid
            sx={{
              overflow: "auto",
            }}
          >
            {users.length > 0 ? (
              users.map((user) => (
                <Grid
                  className="noteContainer"
                  xs={12}
                  sm={12}
                  md={12}
                  key={user.id}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                      width: "100%",
                      marginTop: "1%",
                      marginButtom: "1%",
                      backgroundColor: "#ECECEC",
                      borderRadius: "15px",
                      padding: "2%",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor: "#DFDFDF",
                      },
                    }}
                    onClick={() => handleUserClick(user)}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        flexDirection: "row",
                        alignItems: "start",
                        marginRight: "5%",
                        width: "100%",
                      }}
                    >
                      <Avatar
                        sx={{
                          marginRight: "10%",
                          background: "#7355F7",
                        }}
                        src= {user.imgUrl ? user.imgUrl : ""}
                      >
                     
                      </Avatar>
                      <Typography
                        id="keep-mounted-modal-title"
                        sx={{
                          fontSize: "17px",
                          fontWeight: "800",
                          textTransform: "uppercase",
                          margin: "auto 0",
                        }}
                      >
                        <strong> {user.name}  {user.lastName} </strong>
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))
            ) : (
              <Typography
                id="keep-mounted-modal-title"
                sx={{
                  fontSize: "14px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  textAlign: "center",
                  marginTop: "60%",
                  color: "#B6B4B4",
                }}
              >
                Aucun utilisateur est en mission
              </Typography>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} sm={8} md={8}>
          <Box
            id="map"
            sx={{
              height: "98%",
              width: "100%",
              borderRadius: "15px",
              boxShadow: "0 0 10px rgba(0,0,0,0.2)",

            }}
          ></Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default EmployeeMission;
