import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AgentDashboard from './pages/AgentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminAgents from "./pages/AdminAgents";
import ExplorePackage from "./pages/ExplorePackage";
import AdminLogin from "./pages/AdminLogin.jsx";
import AddPackage from "./pages/AddPackage";
import AdminRegister from "./pages/AdminRegister";
import CustomerAccount from "./pages/CustomerAccount";
import ForgotPassword from './pages/ForgotPassword';
import AgentUpdatePackage from "./pages/AgentUpdatePackage";
import AdminRequests from "./pages/AdminRequests";
import PackageDetails from "./pages/PackageDetails";
import Deals from "./pages/Deals";
import Destination from "./pages/Destination";
import Reviews from "./pages/Reviews";
import BookPackage from "./pages/BookPackage";
import AdminAddPackage from "./pages/AdminAddPackage";
import AdminEditPackage from "./pages/AdminEditPackage";
import Packagespecific from "./pages/Packagespecific";
// import './index.css';
import "./App.css";

// A wrapper to hide the navbar on specific routes (like login)
const AppContent = () => {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/agent") ||
    location.pathname === "/travelhub-admin" ||
    location.pathname === "/travelhub-admin-register";
  return (
    <>
      {!hideNavbar && <Navbar />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/agent-dashboard" element={<AgentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-agents" element={<AdminAgents />} />
          <Route path="/explore" element={<ExplorePackage />} />
          <Route path="/travelhub-admin" element={<AdminLogin />} />
          <Route path="/add-package" element={<AddPackage />} />
          <Route path="/travelhub-admin-register" element={<AdminRegister />} />
          <Route path="/account" element={<CustomerAccount />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/requests" element={<AdminRequests />} />
          <Route path="/agent/update/:id" element={<AgentUpdatePackage />} />
          <Route path="/package/:id" element={<ExplorePackage />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/destination" element={<Destination />} />
          <Route path="/admin/add-package" element={<AdminAddPackage />} />
          <Route path="/admin/edit-package/:id" element={<AdminEditPackage />} />
          <Route path="/packagespecific" element={<Packagespecific />} />
          <Route path="/packagespecific/:destination" element={<Packagespecific />} />
          <Route path="/book/:id" element={<BookPackage />} />
          <Route path="/reviews" element={<Reviews />} />
        </Routes>
      </div>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
