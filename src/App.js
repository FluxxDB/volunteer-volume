import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./components/HomePage";
import ApplyPage from "./components/ApplyPage";
import CalendarPage from "./components/CalendarPage";
import ShiftsPage from "./components/ShiftsPage";
import SignInPage from "./components/SignInPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="apply" element={<ApplyPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="shifts" element={<ShiftsPage />} />
          <Route path="signin" element={<SignInPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
