import React from "react";
import { NavLink } from "react-router-dom";

import { Plane, User, Sparkles } from "lucide-react";

const Navbar = () => {

  const goHome = () => {
    window.location.href = "/";
  };

 

  return (
    <nav className="navbar">

      {/* LEFT */}
      <div className="nav-left" onClick={goHome}>

        <div className="logo-box">
          <Plane size={20} />
          <div className="sparkle-badge">
            <Sparkles size={12}/>
          </div>
        </div>

        <div className="logo-text">
          <span className="logo-title">TravelHub</span>
          <span className="logo-subtitle">Premium Marketplace</span>
        </div>

      </div>


      {/* CENTER NAV */}

      <div className="nav-center">
  <NavLink to="/" className="nav-link">
    Home
  </NavLink>

  <NavLink to="/destinations" className="nav-link">
    Destinations
  </NavLink>
  <NavLink to="/deals" className="nav-link">
    Deals
  </NavLink>

      </div>


      {/* RIGHT */}

      <div className="nav-right">

        <div className="account">
          <User size={18}/>
          <span>My Account</span>
        </div>

        <button className="agent-btn">
          <Sparkles size={16}/>
          Become Agent
        </button>

        <button className="login-btn">
          Login
        </button>

      </div>

    </nav>
  );
};

export default Navbar;