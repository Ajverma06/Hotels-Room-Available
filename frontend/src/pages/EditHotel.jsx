
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "./AdminDashboard.css";

const initialForm = {
    name: "",
    location: "",
    description: "",
    price: "",
    rating: "",
    image: "",
    amenities: ""
};

export default function EditHotel() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchHotel() {
            try {
                const response = await API.get(`/hotels/${id}`);
                const hotel = response.data.hotel;

                setFormData({
                    name: hotel.name || "",
                    location: hotel.location || "",
                    description: hotel.description || "",
                    price: hotel.price ?? "",
                    rating: hotel.rating ?? "",
                    image: hotel.image || "",
                    amenities: Array.isArray(hotel.amenities)
                        ? hotel.amenities.join(", ")
                        : ""
                });
            } catch (err) {
                console.error("Fetch hotel error:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load hotel details."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchHotel();
    }, [id]);

    function handleChange(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");

        if (
            !formData.name.trim() ||
            !formData.location.trim() ||
            !formData.description.trim() ||
            !formData.price ||
            !formData.image.trim()
        ) {
            setError("Please fill all required fields.");
            return;
        }

        if (Number(formData.price) <= 0) {
            setError("Price must be greater than zero.");
            return;
        }

        if (
            formData.rating !== "" &&
            (Number(formData.rating) < 0 ||
                Number(formData.rating) > 5)
        ) {
            setError("Rating must be between 0 and 5.");
            return;
        }

        try {
            setSaving(true);

            const token = localStorage.getItem("hotelpro_token");

            const updatedHotel = {
                ...formData,
                name: formData.name.trim(),
                location: formData.location.trim(),
                description: formData.description.trim(),
                price: Number(formData.price),
                rating: formData.rating === ""
                    ? 0
                    : Number(formData.rating),
                amenities: formData.amenities
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
            };

            const response = await API.put(
                `/hotels/${id}`,
                updatedHotel,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                response.data.message ||
                "Hotel updated successfully!"
            );

            navigate("/admin/hotels");
        } catch (err) {
            console.error("Update hotel error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to update hotel."
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <main className="admin-content">
                <p>Loading hotel details...</p>
            </main>
        );
    }

    return (
        <main className="admin-content">
            <Link to="/admin/hotels" className="back-link">
                ← Back to All Hotels
            </Link>

            <h1>Edit Hotel</h1>
            <p>Update the selected hotel's information.</p>

            {error && (
                <p style={{ color: "red" }}>{error}</p>
            )}

            <form
                onSubmit={handleSubmit}
                style={{
                    maxWidth: "650px",
                    background: "white",
                    padding: "24px",
                    borderRadius: "10px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)"
                }}
            >
                <label>Hotel Name *</label>
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <label>Location *</label>
                <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                />

                <label>Description *</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    required
                />

                <label>Price Per Night (₹) *</label>
                <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="1"
                    required
                />

                <label>Rating (0–5)</label>
                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                />

                <label>Hotel Image URL *</label>
                <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                />

                <label>Amenities (comma separated)</label>
                <input
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    placeholder="WiFi, Swimming Pool, Parking"
                />

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        marginTop: "20px",
                        padding: "12px 20px",
                        background: "#2563eb",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: saving ? "not-allowed" : "pointer"
                    }}
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </main>
    );
}

