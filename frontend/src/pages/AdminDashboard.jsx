import { useEffect, useState } from "react";
import API from "../services/api";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [stats, setStats] = useState({
        totalHotels: 0,
        totalBookings: 0,
        totalUsers: 0,
        revenue: 0,
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("hotelpro_token");

                const response = await API.get("/admin/stats", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setStats(response.data.stats);
            } catch (err) {
                console.error("Dashboard stats error:", err);

                setError(
                    err.response?.data?.message ||
                    "Dashboard data load nahi ho saka."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <h2>HotelPro Admin</h2>

                <nav>
                    <a href="/admin">Dashboard</a>
                    <a href="/">View Website</a>

                    <button
                        onClick={() => {
                            localStorage.removeItem("hotelpro_token");
                            localStorage.removeItem("hotelpro_user");
                            window.location.href = "/login";
                        }}
                    >
                        Logout
                    </button>
                </nav>
            </header>

            <main className="admin-content">
                <h1>Admin Dashboard</h1>
                <p>Welcome to HotelPro Management System!</p>

                {loading && <p>Loading dashboard data...</p>}

                {error && (
                    <p style={{ color: "red" }}>{error}</p>
                )}

                {!loading && !error && (
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
                )}

                <section className="admin-management">
                    <h2>Hotel Management</h2>

                    <div className="admin-actions">
                        <button onClick={() => window.location.href = "/admin/hotels"}>
                            All Hotels
                        </button>

                        <button onClick={() => window.location.href = "/admin/add-hotel"}>
                          Add Hotel
                        </button>

                        <button onClick={() => window.location.href = "/admin/bookings"}>
                           All Bookings
                        </button>

                        <button onClick={() => window.location.href = "/admin/users"}>
                             All Users
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;