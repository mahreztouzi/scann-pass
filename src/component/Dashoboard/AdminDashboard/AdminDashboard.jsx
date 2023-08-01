import React from "react";
import { Route, Routes } from "react-router-dom";
// import Profile from "../Profile/Profile";
import AddEmployee from "../AddEmployee/AddEmployee";
import EmployeeList from "../EmployeeList/EmployeeList";
import SignalAgent from "../SignalAgent/SignalAgent";
import EmployeeMission from "../EmployeeMission/EmployeeMission";

const AdminDashboard = () => {
  return (
    <Routes>
      {/* <Route path="profile" element={<Profile />} /> */}
      <Route path="employeeList" element={<EmployeeList />} />
      <Route path="addEmployee" element={<AddEmployee />} />
      <Route path="signal" element={<SignalAgent />} />
      <Route path="mission" element={<EmployeeMission />} />
    </Routes>
  );
};

export default AdminDashboard;
