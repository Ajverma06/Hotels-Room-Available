
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "./AdminDashboard.css";

export default function AllHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [search, setSearch] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("default");

    async function fetchHotels() {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/hotels");
            setHotels(response.data.hotels || []);
        } catch (err) {
            console.error("Fetch hotels error:", err);
            setError(
                err.response?.data?.message || "Unable to load hotels."
            );
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchHotels();
    }, []);

    async function handleDelete(hotel) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${hotel.name}"?`
        );

        if (!confirmed) return;

        try {
            setDeletingId(hotel._id);

            const token = localStorage.getItem("hotelpro_token");

            const response = await API.delete(`/hotels/${hotel._id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            alert(response.data.message || "Hotel deleted successfully.");

            await fetchHotels();
        } catch (err) {
            console.error("Delete hotel error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to delete hotel."
            );
        } finally {
            setDeletingId(null);
        }
    }

    const filteredHotels = hotels
    .filter((hotel) => {
        const searchText = search.toLowerCase().trim();
        const locationText = locationFilter.toLowerCase().trim();

        const matchesSearch =
            hotel.name?.toLowerCase().includes(searchText);

        const matchesLocation =
            hotel.location?.toLowerCase().includes(locationText);

        return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
        if (sortOrder === "low-high") {
            return Number(a.price) - Number(b.price);
        }

        if (sortOrder === "high-low") {
            return Number(b.price) - Number(a.price);
        }

        return 0;
    });

    return (
        <main className="admin-content">
            <Link to="/admin" className="back-link">
                ← Back to Dashboard
            </Link>

            <h1>All Hotels</h1>
            <div
    style={{
        display: "flex",
        gap: "12px",
        flexWrap: "wrap",
        margin: "20px 0"
    }}
>
    <input
        type="text"
        placeholder="Search hotel name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: "10px", minWidth: "200px" }}
    />

    <input
        type="text"
        placeholder="Filter by location..."
        value={locationFilter}
        onChange={(e) => setLocationFilter(e.target.value)}
        style={{ padding: "10px", minWidth: "200px" }}
    />

    <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        style={{ padding: "10px" }}
    >
        <option value="default">Default Order</option>
        <option value="low-high">Price: Low to High</option>
        <option value="high-low">Price: High to Low</option>
    </select>
</div>
            <p>Manage hotels listed on HotelPro.</p>

            {loading && <p>Loading hotels...</p>}

            {error && (
                <div>
                    <p style={{ color: "red" }}>{error}</p>
                    <button onClick={fetchHotels}>Try Again</button>
                </div>
            )}

            {!loading &&
    !error &&
    hotels.length > 0 &&
    filteredHotels.length === 0 && (
        <p>No hotels match your search.</p>
    )}

            {!loading && !error && filteredHotels.length > 0 && (
                <div style={{ overflowX: "auto" }}>
                    <table style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        marginTop: "20px",
                        background: "white"
                    }}>
                        <thead>
                            <tr>
                                <th style={cellStyle}>Image</th>
                                <th style={cellStyle}>Hotel Name</th>
                                <th style={cellStyle}>Location</th>
                                <th style={cellStyle}>Price / Night</th>
                                <th style={cellStyle}>Rating</th>
                                <th style={cellStyle}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredHotels.map((hotel) => (
                                
                                <tr key={hotel._id}>
                                    <td style={cellStyle}>
                                        <img
                                            src={hotel.image}
                                            alt={hotel.name}
                                            style={{
                                                width: "80px",
                                                height: "55px",
                                                objectFit: "cover",
                                                borderRadius: "6px"
                                            }}
                                        />
                                    </td>

                                    <td style={cellStyle}>{hotel.name}</td>
                                    <td style={cellStyle}>{hotel.location}</td>

                                    <td style={cellStyle}>
                                        ₹{Number(hotel.price).toLocaleString("en-IN")}
                                    </td>

                                    <td style={cellStyle}>
                                        ⭐ {hotel.rating ?? "N/A"}
                                    </td>

                                    <td style={cellStyle}>
                                        <button
                                          onClick={() =>
                                            window.location.href = `/admin/hotels/edit/${hotel._id}`
                                                }
                                           style={{
                                           background: "#2563eb",
                                             color: "white",
                                               border: "none",
                                            padding: "8px 12px",
                                            borderRadius: "5px",
                                            marginRight: "8px",
                                           cursor: "pointer"
                                           }}
                                         >
                                         Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(hotel)}
                                            disabled={deletingId === hotel._id}
                                            style={{
                                                background: "#dc2626",
                                                color: "white",
                                                border: "none",
                                                padding: "8px 12px",
                                                borderRadius: "5px",
                                                cursor: "pointer"
                                            }}
                                        >
                                            {deletingId === hotel._id
                                                ? "Deleting..."
                                                : "Delete"}
                                        </button>
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

const cellStyle = {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    textAlign: "left"
};

