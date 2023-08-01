import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import "./Profile.css";
import userimg from "../../Assets/user.svg";
import { useNavigate } from "react-router-dom";
import { db } from "../Login/FirebaseAuth";
import { doc, updateDoc, getDoc, GeoPoint } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { logoutUser } from "../Login/FirebaseAuth";
import QRCode from "qrcode.react";

const UserProfile = () => {
  const auth = getAuth();
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState();
  const [mail, setMail] = useState();
  const [immatricule, setImmatricule] = useState();
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const infos = await getDoc(doc(db, "Users", user.uid));
      setUsername(infos.data().name);
      setMail(infos.data().email);
      setImmatricule(infos.data().immatricule);
      setUserId(infos.data().userId);
    });

    return unsubscribe;
  }, [auth]);
  const signOut = () => {
    stopTracking();
    logoutUser();
    navigate("/");
  };
  const updateLocation = async (userId, location, isMission) => {
    const userRef = doc(db, "Users", userId);
    const geopoint = new GeoPoint(location.latitude, location.longitude);
    await updateDoc(userRef, { location: geopoint, isMission: isMission });
  };

  const startTracking = () => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        updateLocation(userId, { latitude, longitude }, true);
      });
      setWatchId(id);
      setIsTracking(true);
    } else {
      console.log("La géolocalisation n'est pas supportée par ce navigateur.");
    }
  };

  const stopTracking = async () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, { isMission: false });
      setWatchId(null);
      setIsTracking(false);
    }
  };
  return (
    <Col md={5} className="mx-auto">
      <div className="profile">
        <h2>Profile</h2>
        <div className="profileInfo">
          <img src={userimg} alt="" />
          <h3>{username}</h3>
          <h5>{mail}</h5>
          <h5>Véhicule : {immatricule} </h5>
          <h1
            style={{
              paddingBottom: "10px",
            }}
          >
            Mon code QR
          </h1>
          <div
            style={{
              margin: "0 auto",
            }}
          >
            <QRCode value={userId} style={{ width: "40%", height: "40%" }} />
          </div>
          <button
            className="mainBtn mt-3"
            style={{
              background: isTracking ? "red" : "green",
              marginRight: "2%",
            }}
            onClick={isTracking ? stopTracking : startTracking}
          >
            {isTracking ? "Arrêter la mission" : "En mission"}
          </button>
          <button className="mainBtn mt-3" onClick={signOut}>
            Log out
          </button>
        </div>
      </div>
    </Col>
  );
};

export default UserProfile;
