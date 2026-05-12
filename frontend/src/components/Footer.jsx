import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer-simple">
      <div className="footer-simple-inner">
        <div>
          <h3>RentAI</h3>
          <p>Toronto Rental Intelligence</p>
        </div>

        <div className="footer-simple-links">
          <Link to="/listings">Listings</Link>
          <Link to="/submit-listing">Submit Demo Listing</Link>
          <Link to="/saved">Saved</Link>
          <Link to="/dashboard">Analytics</Link>
          <Link to="/about">About</Link>
          <Link to="/faq">FAQ</Link>
        </div>
      </div>

      <div className="footer-divider" />

      <div className="footer-socials">
        <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">in</a>
        <a href="https://www.instagram.com" target="_blank" rel="noreferrer">◎</a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer">𝕏</a>
        <a href="https://www.facebook.com" target="_blank" rel="noreferrer">f</a>
      </div>

      <p className="footer-copy">
        © 2026 RentAI Toronto. Portfolio project.
      </p>
    </footer>
  );
}

export default Footer;