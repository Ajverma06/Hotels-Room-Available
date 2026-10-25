
import { Link } from "react-router-dom";
import { Hotel, UserRound } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Hotel size={30} />
        <span>HotelPro</span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <a href="#hotels">Explore Hotels</a>
        <Link to="/my-bookings">My Bookings</Link>
      </div>

      <div className="nav-actions">
        <Link to="/login" className="login-link">
          Login
        </Link>

        <Link to="/signup" className="signup-btn">
          <UserRound size={17} />
          Sign Up
        </Link>
      </div>
    </nav>
  );
}

