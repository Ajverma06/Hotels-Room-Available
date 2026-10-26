import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalHotels: 0,
        totalBookings: 0,
        totalUsers: 0,
        revenue: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;

        async function fetchStats() {
            const token = localStorage.getItem("hotelpro_token");

            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            try {
                const response = await API.get("/admin/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (isMounted) {
                    setStats(response.data.stats);
                }
            } catch (err) {
                console.error(
                    "Dashboard stats error:",
                    err.response?.data || err.message
                );

                if (!isMounted) return;

                const status = err.response?.status;

                if (status === 401) {
                    localStorage.removeItem("hotelpro_token");
                    localStorage.removeItem("hotelpro_user");
                    navigate("/login", { replace: true });
                    return;
                }

                if (status === 403) {
                    setError("Admin access required. You cannot access this page.");
                    return;
                }

                setError(
                    err.response?.data?.message ||
                    "Dashboard data load nahi ho saka."
                );
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchStats();

        return () => {
            isMounted = false;
        };
    }, [navigate]);

    function logout() {
        localStorage.removeItem("hotelpro_token");
        localStorage.removeItem("hotelpro_user");
        navigate("/login", { replace: true });
    }

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h2>HotelPro Admin</h2>

                <nav>
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/">View Website</Link>

                    <button onClick={logout}>
                        Logout
                    </button>
                </nav>
            </header>

            <main className="admin-content">
                <h1>Admin Dashboard</h1>

                <p>Welcome to HotelPro Management System!</p>

                {loading && <p>Loading dashboard data...</p>}

                {error && (
                    <p style={{ color: "red" }} role="alert">
                        {error}
                    </p>
                )}

                {!loading && !error && (
                    <>
                        <div className="admin-cards">
                            <div className="admin-card">
                                <h3>Total Hotels</h3>
                                <h2>{stats.totalHotels}</h2>
                            </div>

                            <div className="admin-card">
                                <h3>Total Bookings</h3>
                                <h2>{stats.totalBookings}</h2>
                            </div>

                            <div className="admin-card">
                                <h3>Total Users</h3>
                                <h2>{stats.totalUsers}</h2>
                            </div>

                            <div className="admin-card">
                                <h3>Total Revenue</h3>
                                <h2>
                                    ₹{Number(stats.revenue || 0).toLocaleString("en-IN")}
                                </h2>
                            </div>
                        </div>

                        <section className="admin-management">
                            <h2>Hotel Management</h2>

                            <div className="admin-actions">
                                <button onClick={() => navigate("/admin/hotels")}>
                                    All Hotels
                                </button>

                                <button onClick={() => navigate("/admin/add-hotel")}>
                                    Add Hotel
                                </button>

                                <button onClick={() => navigate("/admin/bookings")}>
                                    All Bookings
                                </button>

                                <button onClick={() => navigate("/admin/users")}>
                                    All Users
                                </button>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;