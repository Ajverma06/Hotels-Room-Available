
import { Link, useNavigate } from "react-router-dom";
import { Hotel, UserRound, LogOut, LayoutDashboard } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();

    let user = null;

    try {
        user = JSON.parse(localStorage.getItem("hotelpro_user"));
    } catch {
        user = null;
    }

    const isLoggedIn = Boolean(
        localStorage.getItem("hotelpro_token") && user
    );

    const name =
        user?.name ||
        user?.username ||
        user?.fullName ||
        "My Account";

    function handleLogout() {
        localStorage.removeItem("hotelpro_token");
        localStorage.removeItem("hotelpro_user");

        navigate("/login");
        window.location.reload();
    }

    return (
        <nav className="navbar">
            <Link to="/" className="logo">
                <Hotel size={30} />
                <span>HotelPro</span>
            </Link>

            <div className="navbar-links">
                <Link to="/">Home</Link>
                <a href="/#hotels">Explore Hotels</a>

                {isLoggedIn && (
                    <Link to="/my-bookings">My Bookings</Link>
                )}
            </div>

            <div className="nav-actions">
                {isLoggedIn ? (
                    <>
                        <Link to="/profile" className="login-link">
                            <UserRound size={17} />
                            {name}
                        </Link>

                        {user.role === "admin" && (
                            <Link
                                to="/admin"
                                className="signup-btn"
                            >
                                <LayoutDashboard size={17} />
                                Admin Dashboard
                            </Link>
                        )}

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="navbar-logout"
                        >
                            <LogOut size={17} />
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="login-link">
                            Login
                        </Link>

                        <Link to="/signup" className="signup-btn">
                            <UserRound size={17} />
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

