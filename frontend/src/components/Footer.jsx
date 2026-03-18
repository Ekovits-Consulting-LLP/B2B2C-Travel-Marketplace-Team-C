import React from "react";
import "../styles/Footer.css";
import {
  FaCircle,
  FaHeart
} from "react-icons/fa";
import { Plane} from "lucide-react";


const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-grid">

        {/* LOGO SECTION */}
        <div>

          <div className="footer-logo">

            <div className="footer-logo-icon">
              <Plane />
            </div>

            <div>
              <div className="footer-title">TravelHub</div>
              <div className="footer-subtitle">Premium Marketplace</div>
            </div>

          </div>

          <p className="footer-description">
            Your trusted B2B2C travel marketplace connecting travelers
            with verified travel agents worldwide.
          </p>

          <div className="footer-trust">
            <FaHeart className="heart-icon" />
            Trusted by 50K+
          </div>

        </div>


        {/* QUICK LINKS */}
        <div>

          <h4>Quick Links</h4>

          <div className="footer-links">

            <a href="#">
              <FaCircle className="dot blue" />
              Destinations
            </a>

            <a href="#">
              <FaCircle className="dot blue" />
              Packages
            </a>


            <a href="#">
              <FaCircle className="dot blue" />
              Become Agent
            </a>

          </div>

        </div>


        {/* SUPPORT */}
        <div>

          <h4>Support</h4>

          <div className="footer-links">

            <a href="#">
              <FaCircle className="dot orange" />
              Help Center
            </a>

            <a href="#">
              <FaCircle className="dot orange" />
              Contact Us
            </a>

            <a href="#">
              <FaCircle className="dot orange" />
              Terms of Service
            </a>

            <a href="#">
              <FaCircle className="dot orange" />
              Privacy Policy
            </a>

          </div>

        </div>


        {/* CONTACT */}
        <div className="footer-contact">

          <h4>Contact</h4>

          <p className="contact-title">Email</p>
          <p>support@travelhub.com</p>

          <p className="contact-title">Phone</p>
          <p>+1-800-TRAVEL</p>

          <div className="footer-status">
            ● Available 24/7
          </div>

        </div>

      </div>


      {/* BOTTOM FOOTER */}

      <div className="footer-bottom">

        <p>
          © 2026 TravelHub. All rights reserved. Made with
          <FaHeart className="heart-icon small-heart" /> for travelers
        </p>

        <div className="footer-social">

          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">Instagram </a>
          <a href="#">LinkedIn </a>

        </div>

      </div>

    </footer>
  );
};

export default Footer;