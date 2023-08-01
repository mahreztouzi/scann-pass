import React from "react";
import { Route, Routes } from "react-router-dom";
import VisiteurListe from "../VisiteurListe/VisiteurListe";
import AddVisiteur from "../AddVisiteur/AddVisiteur";

const ServiceDayoboard = () => {
  return (
    <Routes>
      <Route path="visiteurListe" element={<VisiteurListe />} />
      <Route path="addVisiteur" element={<AddVisiteur />} />
    </Routes>
  );
};

export default ServiceDayoboard;
