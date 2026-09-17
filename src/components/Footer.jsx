import { Link } from "react-router-dom";
import { Mail, Phone, Code2, MapPin } from "lucide-react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-name">Cedar Court</span>
          <p>
            Rental property management, kept in one place for
            landlords and tenants.
          </p>
        </div>

        <div className="footer-links">
          <span className="footer-heading">Explore</span>
          <Link to="/">Home</Link>
          <Link to="/property">Property</Link>
          <Link to="/area">Location</Link>
          <Link to="/about">About</Link>
        </div>

        <div className="footer-links">
          <span className="footer-heading">Access</span>
          <Link to="/tenant">Tenant dashboard</Link>
          <Link to="/landlord">Landlord dashboard</Link>
          <Link to="/login">Log in</Link>
        </div>

        <div className="footer-contact">
          <span className="footer-heading">Get in touch</span>

          <a href="mailto:koechdaisy87@gmail.com" className="footer-contact-item">
            <Mail size={15} />
            koechdaisy87@gmail.com
          </a>

          <a href="tel:+254113304049" className="footer-contact-item">
            <Phone size={15} />
            +254 113 304 049
          </a>

          <span className="footer-contact-item">
            <MapPin size={15} />
            Eldoret, Kenya
          </span>

          <div className="footer-socials">
            <a
            href="https://github.com/daisy-koech"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"><Code2 size={18} />
            </a>

            {/* <a href="https://linkedin.com/in/yourprofile"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"><Linkedin size={18} />
            </a> */}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>
          &copy; {new Date().getFullYear()} Cedar Court.
        </span>
      </div>
    </footer>
  );
}

export default Footer;