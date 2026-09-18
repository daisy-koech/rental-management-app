import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import { getPublicProperty } from "../services/api";
import "./Footer.css";

function Footer() {
  const [property, setProperty] = useState(null);

  useEffect(() => {
    getPublicProperty()
      .then(setProperty)
      .catch((error) => {
        console.error("Failed to load property:", error);
      });
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-inner">

        {/* Brand */}
        <div className="footer-brand">
          <span className="footer-name">
            {property?.name || "Property"}
          </span>

          <p>
            Rental property management, kept in one place for
            landlords and tenants.
          </p>
        </div>

        {/* Explore */}
        <div className="footer-links">
          <span className="footer-heading">Explore</span>

          <Link to="/">Home</Link>
          <Link to="/property">Property</Link>
          <Link to="/area">Location</Link>
          <Link to="/about">About</Link>
        </div>

        {/* Access */}
        <div className="footer-links">
          <span className="footer-heading">Access</span>

          <Link to="/tenant">Tenant dashboard</Link>
          <Link to="/landlord">Landlord dashboard</Link>
          <Link to="/login">Log in</Link>
        </div>

        {/* Personal contact */}
        <div className="footer-contact">
          <span className="footer-heading">Get in touch</span>

          <a
            href="mailto:koechdaisy87@gmail.com"
            className="footer-contact-item"
          >
            <Mail size={15} />
            koechdaisy87@gmail.com
          </a>

          <a
            href="tel:+254113304049"
            className="footer-contact-item"
          >
            <Phone size={15} />
            +254 113 304 049
          </a>

          <span className="footer-contact-item">
            <MapPin size={15} />
            Eldoret, Kenya
          </span>

          <div className="footer-socials">
            {/* Social links can be added later */}
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <span>
          &copy; {new Date().getFullYear()}{" "}
          {property?.name || "Property"}.
        </span>
      </div>
    </footer>
  );
}

export default Footer;