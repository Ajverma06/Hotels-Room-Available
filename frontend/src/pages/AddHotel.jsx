import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, Plus, Hotel } from "lucide-react";
import API from "../services/api";
import "./AdminDashboard.css";

export default function AddHotel() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        location: "",
        description: "",
        price: "",
        rating: "",
        image: "",
        amenities: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            setLoading(true);

            const token = localStorage.getItem("hotelpro_token");

            if (!token) {
                setError("Please login as an admin first.");
                return;
            }

            const hotelData = {
                ...formData,
                price: Number(formData.price),
                rating: formData.rating === ""
                    ? 0
                    : Number(formData.rating),
                amenities: formData.amenities
                    .split(",")
                    .map((item) => item.trim())
                    .filter(Boolean)
            };

            const response = await API.post(
                "/hotels",
                hotelData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(
                response.data.message ||
                "Hotel added successfully!"
            );

            navigate("/admin/hotels");
        } catch (err) {
            console.error("Add hotel error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to add hotel. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="add-hotel-page">
            <Link to="/admin" className="add-hotel-back">
                <ArrowLeft size={18} />
                <span>Back to Dashboard</span>
            </Link>

            <div className="add-hotel-heading">
                <div className="add-hotel-heading-icon">
                    <Hotel size={28} />
                </div>

                <h1>Add New Hotel</h1>

                <p>
                    Add a new property to your HotelPro collection.
                    Fill in the details below.
                </p>
            </div>

            <section className="add-hotel-card">
                <div className="add-hotel-card-header">
                    <div>
                        <h2>Hotel Information</h2>
                        <p>
                            Fields marked with * are required.
                        </p>
                    </div>

                    <MapPin size={25} />
                </div>

                {error && (
                    <div className="add-hotel-error" role="alert">
                        {error}
                    </div>
                )}

                <form
                    className="add-hotel-form"
                    onSubmit={handleSubmit}
                >
                    <div className="add-hotel-field">
                        <label htmlFor="name">
                            Hotel Name *
                        </label>

                        <input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter hotel name"
                            required
                        />
                    </div>

                    <div className="add-hotel-field">
                        <label htmlFor="location">
                            Location *
                        </label>

                        <input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter city or location"
                            required
                        />
                    </div>

                    <div className="add-hotel-field">
                        <label htmlFor="price">
                            Price Per Night (₹) *
                        </label>

                        <input
                            id="price"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Example: 2500"
                            min="1"
                            required
                        />
                    </div>

                    <div className="add-hotel-field">
                        <label htmlFor="rating">
                            Rating (0–5)
                        </label>

                        <input
                            id="rating"
                            type="number"
                            name="rating"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="Example: 4.5"
                            min="0"
                            max="5"
                            step="0.1"
                        />
                    </div>

                    <div className="add-hotel-field full-width">
                        <label htmlFor="description">
                            Hotel Description *
                        </label>

                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the hotel, rooms and facilities..."
                            rows="4"
                            required
                        />
                    </div>

                    <div className="add-hotel-field full-width">
                        <label htmlFor="image">
                            Hotel Image URL *
                        </label>

                        <input
                            id="image"
                            type="url"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            placeholder="https://example.com/hotel.jpg"
                            required
                        />

                        {formData.image.trim() && (
                            <div className="add-hotel-image-preview">
                                <img
                                    src={formData.image}
                                    alt="Hotel preview"
                                    onError={(e) => {
                                        e.currentTarget.style.display =
                                            "none";
                                    }}
                                    onLoad={(e) => {
                                        e.currentTarget.style.display =
                                            "block";
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="add-hotel-field full-width">
                        <label htmlFor="amenities">
                            Amenities
                        </label>

                        <input
                            id="amenities"
                            name="amenities"
                            value={formData.amenities}
                            onChange={handleChange}
                            placeholder="WiFi, Swimming Pool, Parking"
                        />

                        <small className="add-hotel-help">
                            Separate amenities with commas.
                        </small>
                    </div>

                    <div className="add-hotel-actions">
                        <button
                            type="button"
                            className="add-hotel-cancel"
                            onClick={() =>
                                navigate("/admin/hotels")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="add-hotel-submit"
                            disabled={loading}
                        >
                            <Plus size={19} />

                            {loading
                                ? "Adding Hotel..."
                                : "Add Hotel"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}