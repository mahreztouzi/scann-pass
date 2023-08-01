// import React from "react";
// import { Col } from "react-bootstrap";
// import toast from "react-hot-toast";
// import "./Profile.css";
// import userimg from "../../../Assets/user.svg";
// import { handleSignOut } from "../../Login/LoginManager";
// import { SET_USER, useAppContext } from "../../../context";
// import { useNavigate } from "react-router-dom";
// import { db, useAuth } from "../../Login/FirebaseAuth";
// import {
//   onSnapshot,
//   doc,
//   collection,
//   updateDoc,
//   getDoc,
//   query,
//   where,
//   orderBy,
// } from "firebase/firestore";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { useEffect, useState } from "react";
// import { logoutUser } from "../../Login/FirebaseAuth";
// const Profile = () => {
//   const auth = getAuth();
//   const [userId, setUserId] = useState();
//   const [userInfos, setUserInfos] = useState();
//   const [username, setUsername] = useState();
//   const [mail, setMail] = useState();
//   const [immatricule, setImmatricule] = useState();
//   const [currentUser, setCurrentUser] = useState();
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (user) => {
//       setCurrentUser(user.uid);
//       const infos = await getDoc(doc(db, "Users", user.uid));
//       setUserInfos(infos.data());
//       setUsername(infos.data().name);
//       setMail(infos.data().email);
//       setImmatricule(infos.data().immatricule);
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const signOut = () => {
//     logoutUser();
//     navigate("/");
//   };
//   return (
//     <Col md={5} className="mx-auto">
//       <div className="profile">
//         <h2>Profile</h2>
//         <div className="profileInfo">
//           <img src={userimg} alt="" />

//           <h5>Véhicule : </h5>

//           <button className="mainBtn mt-3" onClick={signOut}>
//             Log out
//           </button>
//         </div>
//       </div>
//     </Col>
//   );
// };

// export default Profile;
