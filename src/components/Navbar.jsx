import { Plane, User, Sparkles } from "lucide-react";

function Navbar() {
  return (
    <div className="navbar">

      {/* LEFT LOGO */}
      <div className="navbar-left">

        <div className="logo-box">
          <Plane className="plane-icon" />

          <span className="sparkle-icon">
            <Sparkles size={10} />
          </span>
        </div>

        <div className="logo-text">
          <h3>TravelHub</h3>
          <p>Premium Marketplace</p>
        </div>

      </div>


      {/* CENTER NAV */}
      <div className="navbar-center">
        <span>Home</span>
        <span className="active">Destinations</span>
        <span>Compare</span>
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