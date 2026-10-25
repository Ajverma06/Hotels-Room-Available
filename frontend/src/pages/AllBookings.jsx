
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./AdminDashboard.css";

export default function AllBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("all");
const [sortOrder, setSortOrder] = useState("newest");

    useEffect(() => {
        async function fetchBookings() {
            try {
                const token = localStorage.getItem("hotelpro_token");

                const response = await API.get("/admin/bookings", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setBookings(response.data.bookings || []);
            } catch (err) {
                console.error("Fetch bookings error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load bookings."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchBookings();
    }, []);


    const filteredBookings = bookings
    .filter((booking) => {
        const searchText = search.toLowerCase().trim();

        const customerName =
            booking.user?.name?.toLowerCase() || "";

        const customerEmail =
            booking.user?.email?.toLowerCase() || "";

        const hotelName =
            booking.hotel?.name?.toLowerCase() || "";

        const matchesSearch =
            customerName.includes(searchText) ||
            customerEmail.includes(searchText) ||
            hotelName.includes(searchText);

        const matchesStatus =
            statusFilter === "all" ||
            booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();

        return sortOrder === "newest"
            ? dateB - dateA
            : dateA - dateB;
    });

    return (
        <main className="admin-content">
            <Link to="/admin" className="back-link">
                ← Back to Dashboard
            </Link>

            <h1>All Bookings</h1>
            <div className="booking-filters">
    <input
        type="text"
        placeholder="Search customer or hotel..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
    />

    <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
    >
        <option value="all">All Statuses</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
    </select>

    <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
    >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
    </select>
</div>
            <p>View and manage all customer bookings.</p>

            {loading && <p>Loading bookings...</p>}

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            {!loading && !error && filteredBookings.length === 0 && (
                <p>No bookings found.</p>
            )}

            {!loading && !error && filteredBookings.length > 0 && (
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
                                <th style={cellStyle}>Customer</th>
                                <th style={cellStyle}>Hotel</th>
                                <th style={cellStyle}>Check-in</th>
                                <th style={cellStyle}>Check-out</th>
                                <th style={cellStyle}>Guests</th>
                                <th style={cellStyle}>Total Price</th>
                                <th style={cellStyle}>Status</th>
                                <th style={cellStyle}>Booked On</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td style={cellStyle}>
                                        <strong>
                                            {booking.user?.name || "User unavailable"}
                                        </strong>
                                        <br />
                                        <small>
                                            {booking.user?.email || "—"}
                                        </small>
                                    </td>

                                    <td style={cellStyle}>
                                        <strong>
                                            {booking.hotel?.name || "Hotel unavailable"}
                                        </strong>
                                        <br />
                                        <small>
                                            {booking.hotel?.location || "—"}
                                        </small>
                                    </td>

                                    <td style={cellStyle}>
                                        {formatDate(booking.checkIn)}
                                    </td>

                                    <td style={cellStyle}>
                                        {formatDate(booking.checkOut)}
                                    </td>

                                    <td style={cellStyle}>
                                        {booking.guests}
                                    </td>

                                    <td style={cellStyle}>
                                        ₹{Number(booking.totalPrice || 0).toLocaleString("en-IN")}
                                    </td>

                                    <td style={cellStyle}>
                                        <span
                                            style={{
                                                padding: "5px 9px",
                                                borderRadius: "12px",
                                                background:
                                                    booking.status === "confirmed"
                                                        ? "#dcfce7"
                                                        : "#fee2e2",
                                                color:
                                                    booking.status === "confirmed"
                                                        ? "#166534"
                                                        : "#991b1b"
                                            }}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>

                                    <td style={cellStyle}>
                                        {formatDate(booking.createdAt)}
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

