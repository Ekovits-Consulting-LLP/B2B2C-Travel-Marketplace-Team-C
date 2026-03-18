import { FaHeart } from "react-icons/fa";
import { Plane} from "lucide-react";
import "../styles/footer.css";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-top">

        {/* BRAND */}
        <div className="footer-brand">

          <div className="footer-logo">

            {/* LOGO ICON BOX */}
            <div className="logo-box">
              <Plane size={20}/>
            </div>

            {/* LOGO TEXT */}
            <div className="logo-text">
              <h3 className="footer-brand-name">TravelHub</h3>
              <p className="footer-brand-subtitle">Premium Marketplace</p>
            </div>

          </div>

          <p className="footer-desc">
            Your trusted B2B2C travel marketplace connecting travelers with verified travel agents worldwide.
          </p>

          <div className="trusted">
            <FaHeart className="heart" />
            Trusted by 50K+
          </div>

        </div>


        {/* QUICK LINKS */}
        <div className="footer-links">
          <h4 className="footer-heading">Quick Links</h4>

          <ul className="links-blue">
            <li>Destinations</li>
            <li>Packages</li>
            <li>Compare</li>
            <li>Become Agent</li>
          </ul>
        </div>


        {/* SUPPORT */}
        <div className="footer-links">
          <h4 className="footer-heading">Support</h4>

          <ul className="links-orange">
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
          </ul>
        </div>


        {/* CONTACT */}
        <div className="footer-contact">

          <h4 className="footer-heading">Contact</h4>

          <p className="contact-title">Email</p>
          <p className="contact-text">support@travelhub.com</p>

          <p className="contact-title">Phone</p>
          <p className="contact-text">+1-800-TRAVEL</p>

          <div className="status">
            ● Available 24/7
          </div>

        </div>

      </div>


      <hr className="footer-divider" />


      <div className="footer-bottom">

        <p className="copyright">
          © 2026 TravelHub. All rights reserved. Made with
          <span className="heart-orange"> ❤ </span>
          for travelers
        </p>

        <div className="social">
          <span>Facebook</span>
          <span>Twitter</span>
          <span>Instagram</span>
          <span>LinkedIn</span>
        </div>

      </div>

    </footer>
  );
}

export default Footer;