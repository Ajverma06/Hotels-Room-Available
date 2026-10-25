
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./AdminDashboard.css";

export default function AllUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchUsers() {
            try {
                const token = localStorage.getItem("hotelpro_token");

                const response = await API.get("/admin/users", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setUsers(response.data.users || []);
            } catch (err) {
                console.error("Fetch users error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load users."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchUsers();
    }, []);

    return (
        <main className="admin-content">
            <Link to="/admin" className="back-link">
                ← Back to Dashboard
            </Link>

            <h1>All Users</h1>
            <p>View all registered HotelPro users.</p>

            {!loading && !error && (
                <h3>Total Users: {users.length}</h3>
            )}

            {loading && <p>Loading users...</p>}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            {!loading && !error && users.length === 0 && (
                <p>No users found.</p>
            )}

            {!loading && !error && users.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            marginTop: "20px",
                            background: "white"
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={cellStyle}>#</th>
                                <th style={cellStyle}>Name</th>
                                <th style={cellStyle}>Email</th>
                                <th style={cellStyle}>Role</th>
                                <th style={cellStyle}>Registered On</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id}>
                                    <td style={cellStyle}>
                                        {index + 1}
                                    </td>

                                    <td style={cellStyle}>
                                        {user.name}
                                    </td>

                                    <td style={cellStyle}>
                                        {user.email}
                                    </td>

                                    <td style={cellStyle}>
                                        <span
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "12px",
                                                background:
                                                    user.role === "admin"
                                                        ? "#dbeafe"
                                                        : "#dcfce7",
                                                color:
                                                    user.role === "admin"
                                                        ? "#1d4ed8"
                                                        : "#166534"
                                            }}
                                        >
                                            {user.role || "user"}
                                        </span>
                                    </td>

                                    <td style={cellStyle}>
                                        {formatDate(user.createdAt)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

const cellStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left",
    whiteSpace: "nowrap"
};

