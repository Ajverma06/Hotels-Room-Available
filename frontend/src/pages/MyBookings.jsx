import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarDays, MapPin, Users, ArrowLeft, XCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function MyBookings() {
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("hotelpro_token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetchBookings();
    }, [navigate]);

    async function fetchBookings() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("hotelpro_token");

            const response = await API.get("/bookings/my-bookings", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBookings(response.data.bookings || []);
        } catch (err) {
            console.error("Fetch bookings error:", err);

            setError(
                err.response?.data?.message ||
                "Unable to load your bookings."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleCancel(bookingId) {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setCancellingId(bookingId);

            const token = localStorage.getItem("hotelpro_token");

            const response = await API.patch(
                `/bookings/${bookingId}/cancel`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert(response.data.message || "Booking cancelled successfully.");

            await fetchBookings();
        } catch (err) {
            console.error("Cancel booking error:", err);

            alert(
                err.response?.data?.message ||
                "Unable to cancel booking."
            );
        } finally {
            setCancellingId(null);
        }
    }

    function formatDate(date) {
        if (!date) return "N/A";

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    return (
        <>
            <Navbar />

            <main className="my-bookings-page">
                <div className="my-bookings-container">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={18} />
                        Back to Home
                    </Link>

                    <div className="my-bookings-heading">
                        <span className="section-label">YOUR STAYS</span>
                        <h1>My Bookings</h1>
                        <p>Manage your reservations and upcoming stays.</p>
                    </div>

                    {loading ? (
                        <div className="empty-state">
                            <p>Loading your bookings...</p>
                        </div>
                    ) : error ? (
                        <div className="empty-state">
                            <h3>Unable to load bookings</h3>
                            <p>{error}</p>

                            <button
                                className="view-btn"
                                onClick={fetchBookings}
                            >
                                Try Again
                            </button>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="empty-state">
                            <CalendarDays size={42} />

                            <h2>No bookings yet</h2>

                            <p>
                                You haven't booked a hotel yet.
                                Explore our hotels and plan your next stay!
                            </p>

                            <Link to="/" className="view-btn">
                                Explore Hotels
                            </Link>
                        </div>
                    ) : (
                        <div className="my-bookings-list">
                            {bookings.map((booking) => {
                                const hotel = booking.hotel;

                                return (
                                    <article
                                        className="booking-card"
                                        key={booking._id}
                                    >
                                        <img
                                            className="booking-hotel-image"
                                            src={
                                                hotel?.image ||
                                                "https://placehold.co/600x400?text=Hotel"
                                            }
                                            alt={hotel?.name || "Hotel"}
                                        />

                                        <div className="booking-card-content">
                                            <div className="booking-card-header">
                                                <div>
                                                    <h2>
                                                        {hotel?.name ||
                                                            "Hotel unavailable"}
                                                    </h2>

                                                    <p className="booking-location">
                                                        <MapPin size={16} />
                                                        {hotel?.location ||
                                                            "Location unavailable"}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`booking-status ${
                                                        booking.status === "cancelled"
                                                            ? "cancelled"
                                                            : "confirmed"
                                                    }`}
                                                >
                                                    {booking.status ||
                                                        "confirmed"}
                                                </span>
                                            </div>

                                            <div className="booking-info-grid">
                                                <div>
                                                    <CalendarDays size={18} />
                                                    <span>
                                                        <small>Check-in</small>
                                                        <strong>
                                                            {formatDate(
                                                                booking.checkIn
                                                            )}
                                                        </strong>
                                                    </span>
                                                </div>

                                                <div>
                                                    <CalendarDays size={18} />
                                                    <span>
                                                        <small>Check-out</small>
                                                        <strong>
                                                            {formatDate(
                                                                booking.checkOut
                                                            )}
                                                        </strong>
                                                    </span>
                                                </div>

                                                <div>
                                                    <Users size={18} />
                                                    <span>
                                                        <small>Guests</small>
                                                        <strong>
                                                            {booking.guests}
                                                        </strong>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="booking-card-footer">
                                                <div>
                                                    <small>Total Price</small>
                                                    <strong className="booking-price">
                                                        ₹
                                                        {Number(
                                                            booking.totalPrice || 0
                                                        ).toLocaleString("en-IN")}
                                                    </strong>
                                                </div>

                                                {booking.status !==
                                                    "cancelled" && (
                                                    <button
                                                        className="cancel-booking-btn"
                                                        onClick={() =>
                                                            handleCancel(
                                                                booking._id
                                                            )
                                                        }
                                                        disabled={
                                                            cancellingId ===
                                                            booking._id
                                                        }
                                                    >
                                                        <XCircle size={17} />

                                                        {cancellingId ===
                                                        booking._id
                                                            ? "Cancelling..."
                                                            : "Cancel Booking"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}