import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import JobOpeningsPage from "./pages/Careers/JobOpeningsPage";
import JobPostingDetailPage from "./pages/Careers/JobPostingDetailPage";
import JobApplicationFormPage from "./pages/Careers/JobApplicationFormPage";
import PropertyListPage from "./pages/Public/PropertyListPage";
import PropertyDetailPage from "./pages/Public/PropertyDetailPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import LoginPage from "./pages/Auth/LoginPage";
import HomePage from "./pages/Public/HomePage";
import NotFoundPage from "./pages/Utility/NotFoundPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertyListPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/careers" element={<JobOpeningsPage />} />
        <Route path="/careers/:id" element={<JobPostingDetailPage />} />
        <Route path="/careers/:id/apply" element={<JobApplicationFormPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
