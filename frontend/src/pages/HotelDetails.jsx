import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import API from "../services/api";

export default function HotelDetails() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [checkIn, setCheckIn] = useState("");
      const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [bookingLoading, setBookingLoading] = useState(false);

    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchHotel() {
            try {
                setLoading(true);

                const response = await API.get(`/hotels/${id}`);

                setHotel(response.data.hotel);
            } catch (err) {
                console.error("Hotel details error:", err);
                setError("Hotel details load nahi ho sake.");
            } finally {
                setLoading(false);
            }
        }

        fetchHotel();
    }, [id]);

    if (loading) {
        return <div className="empty-state">Loading hotel details...</div>;
    }

    if (error || !hotel) {
        return (
            <div className="empty-state">
                <h2>{error || "Hotel not found"}</h2>
                <Link to="/">Back to Home</Link>
            </div>
        );
    }

    async function handleBooking() {
    const token = localStorage.getItem("hotelpro_token");

    if (!token) {
        alert("Please login first to book a hotel.");
        navigate("/login");
        return;
    }

    if (!checkIn || !checkOut) {
        alert("Please select check-in and check-out dates.");
        return;
    }

    if (checkOut <= checkIn) {
        alert("Check-out date must be after check-in date.");
        return;
    }

    if (!Number.isInteger(Number(guests)) || Number(guests) < 1) {
        alert("Please select a valid number of guests.");
        return;
    }

    try {
        setBookingLoading(true);

        const response = await API.post(
            "/bookings",
            {
                hotelId: id,
                checkIn,
                checkOut,
                guests: Number(guests)
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(response.data.message || "Booking successful!");

        navigate("/my-bookings");
    } catch (error) {
        console.error("Booking error:", error);

        alert(
            error.response?.data?.message ||
            "Booking failed. Please try again."
        );
    } finally {
        setBookingLoading(false);
    }
}

    return (
        <main className="hotel-details-page">
            <Link to="/" className="back-link">
                <ArrowLeft size={18} /> Back to Hotels
            </Link>

            <div className="hotel-details-card">
                <img
                    src={hotel.image}
                    alt={hotel.name}
                    className="hotel-details-image"
                />

                <div className="hotel-details-content">
                    <div className="hotel-location">
                        <MapPin size={18} />
                        {hotel.location}
                    </div>

                    <h1>{hotel.name}</h1>

                    <p className="hotel-description">
                        {hotel.description}
                    </p>

                    <div className="hotel-rating">
                        <Star size={20} fill="currentColor" />
                        <span>{hotel.rating || "Not rated"}</span>
                    </div>

                    <h3>Amenities</h3>

                    <div className="amenities-list">
                        {hotel.amenities?.length > 0 ? (
                            hotel.amenities.map((amenity, index) => (
                                <span key={index} className="amenity-item">
                                    {amenity}
                                </span>
                            ))
                        ) : (
                            <p>Amenities information not available.</p>
                        )}
                    </div>

                    <div className="booking-form">
    <h3>Book Your Stay</h3>

    <label>
        Check-in
        <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckIn(e.target.value)}
        />
    </label>

    <label>
        Check-out
        <input
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split("T")[0]}
            onChange={(e) => setCheckOut(e.target.value)}
        />
    </label>

    <label>
        Guests
        <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
        >
            <option value={1}>1 Guest</option>
            <option value={2}>2 Guests</option>
            <option value={3}>3 Guests</option>
            <option value={4}>4 Guests</option>
            <option value={5}>5 Guests</option>
        </select>
    </label>
</div>

                    <div className="hotel-booking-footer">
                        <div>
                            <strong>₹{hotel.price}</strong>
                            <span> / night</span>
                        </div>

                        <button
    className="view-btn"
    onClick={handleBooking}
    disabled={bookingLoading}
>
    {bookingLoading ? "Booking..." : "Book Now"}
</button>
                    </div>
                </div>
            </div>
        </main>
    );
}