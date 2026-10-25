
import { Link } from "react-router-dom";
import { Hotel, UserRound } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <Hotel size={30} />
        <span>HotelPro</span>
      </Link>

      <div className="navbar-links">
    <a href="/">Home</a>
    <a href="/#hotels">Explore Hotels</a>
    <a href="/my-bookings">My Bookings</a>
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

