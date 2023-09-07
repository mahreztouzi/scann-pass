import React, { useEffect, useState } from "react";
import { Button, Col, Modal } from "react-bootstrap";
import "./Profile.css";
import userimg from "../../Assets/user.svg";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, getDoc, GeoPoint } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { logoutUser, db, storage } from "../Login/FirebaseAuth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import QRCode from "qrcode.react";
import Swal from "sweetalert2";

const UserProfile = () => {
  const auth = getAuth();
  const [userId, setUserId] = useState();
  const [username, setUsername] = useState();
  const [lastName, setLastName] = useState();
  const [mail, setMail] = useState();
  const [immatricule, setImmatricule] = useState();
  const [isTracking, setIsTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [showModal, setShowModal] = useState(true);
  const [imgUrl, setImgUrl] = useState()
  const [selectedImage, setSelectedImage] = useState(null);


  const navigate = useNavigate();



  const handleFileChange = async (event) => {
    const file = event.target.files[0]; // Sélectionnez le premier fichier du champ de fichier
    if (file) {
      const dataURL = await fileToDataURL(file);
      setSelectedImage(dataURL);
    } else {
      Swal.fire({
        title: "Aucun fichier",
        text: "Veuillez ajouter une image s'il vous plait !.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }

  };

  const handleOpenModale = () => {
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      const infos = await getDoc(doc(db, "Users", user.uid));
      setUsername(infos.data().name);
      setLastName(infos.data().lastName);
      setMail(infos.data().email);
      setImmatricule(infos.data().immatricule);
      setUserId(infos.data().userId);
      fetchImgEmploye(userId);
    });

    return unsubscribe;
  }, [auth,userId]);
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


  // Fonction pour convertir un fichier en Data URL
  const fileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event.target.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  // *** envoyer l'image a storage 
  const uploadImageToStorage = async (userId, imageCapture) => {
    try {
      // Créez une référence unique pour l'image en utilisant l'ID de l'utilisateur
      const storageRef = ref(storage, `userImg/${userId}.jpeg`);

      // Convertissez la capture d'image en blob
      const blob = dataURLtoBlob(imageCapture);

      // Téléchargez le blob dans Firebase Storage en utilisant uploadBytes
      await uploadBytes(storageRef, blob);

    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  // Fonction pour convertir une data URL en blob
  function dataURLtoBlob(dataURL) {
    // Vérifiez si dataURL est défini et non null
    if (!dataURL) {
      return null;
    }

    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }

  // *** fin image storage 

  const fetchImgEmploye = async (visitorId) => {
    try {
      const imgUserRef = ref(storage, `userImg/${visitorId}.png`);
      const imgUser = await getDownloadURL(imgUserRef);
      setImgUrl(imgUser)
    } catch (error) {
      console.error("Erreur lors de la récupération du code QR :", error);
    }
  };


  return (
    <Col >
      <div className="profile" style={{ height: "95vh", marginTop: "1%" }}>
        <h2>Profile</h2>
        <div >
          <img src={userimg} alt="imgEmploy" />
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
            <h3 style={{ marginRight: "3%" }}>{username}</h3>
            <h3>{lastName}</h3>
          </div>
          <h5>{mail}</h5>
          <h5>Véhicule : {immatricule} </h5>
          <h3
            style={{
              paddingBottom: "5px",
              color: "green",
              fontWeight: "bold"
            }}
          >
            Mon code QR
          </h3>
          <div
            style={{
              margin: "0 auto",
            }}
          >
            <QRCode value={userId} style={{ width: "40%", height: "40%" }} />
          </div>
          {/* la modale pour ajout de l'image */}
          <Modal
            show={showModal}
            onHide={handleCloseModal}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                Ajout d'une photo de profile
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ textAlign: "center" }}>
              <input type="file" onChange={handleFileChange} />
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => uploadImageToStorage(userId, selectedImage)} disabled={!selectedImage} >Confirmer</Button>
            </Modal.Footer>
          </Modal>
          {/* fin modale */}
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
