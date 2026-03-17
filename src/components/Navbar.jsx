import { Plane, User, Sparkles } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const [activeTab , setActiveTab] = useState("destinations");

  return (
    <div className="navbar">

      {/* LEFT LOGO */}
      <div className="navbar-left">

        <div className="logo-box">
        
          <Plane size={20}/>

          <span className="sparkle-icon">
            <Sparkles size={12} />
          </span>
        </div>

        <div className="logo-text">
          <h3>TravelHub</h3>
          <p>Premium Marketplace</p>
        </div>

      </div>


      {/* CENTER NAV */}
      <div className="navbar-center">

<span
className={activeTab==="home" ? "active" : ""}
onClick={()=>setActiveTab("home")}
>
Home
</span>

<span
className={activeTab==="destinations" ? "active" : ""}
onClick={()=>setActiveTab("destinations")}
>
Destinations
</span>

<span
className={activeTab==="deals" ? "active" : ""}
onClick={()=>setActiveTab("deals")}
>
Deals
</span>

</div>

      {/* RIGHT NAV */}
      <div className="navbar-right">

        <div className="account">
          <User size={16}/>
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

    </div>
  );
}

export default Navbar;