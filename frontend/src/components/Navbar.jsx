import { Link, NavLink } from "react-router-dom";

function Navbar() {
  return (
    <header className="nav-shell">
      <nav className="navbar">
        <Link to="/" className="logo">
          <span className="logo-icon">🏙️</span>
          <span>
            RentAI
            <small>Toronto</small>
          </span>
        </Link>

        <div className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/listings">Listings</NavLink>
          <NavLink to="/saved">Saved</NavLink>
          <NavLink to="/dashboard">Analytics</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
        </div>

      </nav>
    </header>
  );
}

export default Navbar;