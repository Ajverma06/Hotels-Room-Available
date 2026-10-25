
import { useEffect, useState } from "react";
import {
    Search,
    CalendarDays,
    MapPin,
    ShieldCheck,
    Headset,
    BadgeCheck
} from "lucide-react";

import Navbar from "../components/Navbar";
import HotelCard from "../components/HotelCard";
import API from "../services/api";

export default function Home() {
    // Hotels fetched from backend
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Search form states
    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState("2 Guests");
    const [searchLocation, setSearchLocation] = useState("");

    // Fetch hotels from MongoDB through backend API
    useEffect(() => {
        async function fetchHotels() {
            try {
                setLoading(true);
                setError("");

                const response = await API.get("/hotels");

                setHotels(response.data.hotels || []);
            } catch (err) {
                console.error("Error fetching hotels:", err);

                setError(
                    err.response?.data?.message ||
                    "Unable to load hotels. Please check your backend."
                );
            } finally {
                setLoading(false);
            }
        }

        fetchHotels();
    }, []);

    // Filter hotels by name or location
    const filteredHotels = hotels.filter((hotel) =>
        `${hotel.name} ${hotel.location}`
            .toLowerCase()
            .includes(searchLocation.toLowerCase())
    );

    // Handle search form
    function handleSearch(event) {
        event.preventDefault();

        if (checkIn && checkOut && checkOut <= checkIn) {
            alert("Check-out date must be after check-in date.");
            return;
        }

        setSearchLocation(location.trim());

        document.getElementById("hotels")?.scrollIntoView({
            behavior: "smooth"
        });
    }

    return (
        <>
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <span className="hero-badge">
                            YOUR COMFORT, OUR PRIORITY
                        </span>

                        <h1>
                            Find Your Perfect
                            <br />
                            <span>Place to Stay.</span>
                        </h1>

                        <p>
                            Discover amazing hotels, enjoy unforgettable stays,
                            and book your next trip with confidence.
                        </p>

                        {/* Search Form */}
                        <form
                            className="search-box"
                            onSubmit={handleSearch}
                        >
                            <label className="search-field">
                                <MapPin size={21} />

                                <span>
                                    <small>Destination</small>

                                    <input
                                        type="text"
                                        placeholder="Where are you going?"
                                        value={location}
                                        onChange={(e) =>
                                            setLocation(e.target.value)
                                        }
                                    />
                                </span>
                            </label>

                            <label className="search-field">
                                <CalendarDays size={21} />

                                <span>
                                    <small>Check-in</small>

                                    <input
                                        type="date"
                                        value={checkIn}
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) => {
                                            setCheckIn(e.target.value);

                                            if (
                                                checkOut &&
                                                e.target.value >= checkOut
                                            ) {
                                                setCheckOut("");
                                            }
                                        }}
                                        required
                                    />
                                </span>
                            </label>

                            <label className="search-field">
                                <CalendarDays size={21} />

                                <span>
                                    <small>Check-out</small>

                                    <input
                                        type="date"
                                        value={checkOut}
                                        min={
                                            checkIn ||
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        onChange={(e) =>
                                            setCheckOut(e.target.value)
                                        }
                                        required
                                    />
                                </span>
                            </label>

                            <label className="search-field guests-field">
                                <span>
                                    <small>Guests</small>

                                    <select
                                        value={guests}
                                        onChange={(e) =>
                                            setGuests(e.target.value)
                                        }
                                    >
                                        <option>1 Guest</option>
                                        <option>2 Guests</option>
                                        <option>3 Guests</option>
                                        <option>4 Guests</option>
                                        <option>5+ Guests</option>
                                    </select>
                                </span>
                            </label>

                            <button
                                className="search-btn"
                                type="submit"
                            >
                                <Search size={20} />
                                Search
                            </button>
                        </form>

                        {/* Statistics */}
                        <div className="hero-stats">
                            <div>
                                <strong>{hotels.length}+</strong>
                                <span>Hotels</span>
                            </div>

                            <div>
                                <strong>10K+</strong>
                                <span>Happy Guests</span>
                            </div>

                            <div>
                                <strong>4.8/5</strong>
                                <span>Guest Rating</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="features">
                    <div className="feature-item">
                        <ShieldCheck size={30} />

                        <div>
                            <h3>Secure Booking</h3>
                            <p>
                                Your bookings are handled securely.
                            </p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <BadgeCheck size={30} />

                        <div>
                            <h3>Best Price</h3>
                            <p>
                                Find a stay that fits your budget.
                            </p>
                        </div>
                    </div>

                    <div className="feature-item">
                        <Headset size={30} />

                        <div>
                            <h3>Guest Support</h3>
                            <p>
                                Help when you need it.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Hotels Section */}
                <section
                    className="hotels-section"
                    id="hotels"
                >
                    <div className="section-heading">
                        <div>
                            <span className="section-label">
                                HANDPICKED FOR YOU
                            </span>

                            <h2>Popular Hotels</h2>

                            <p>
                                Explore comfortable stays for your next
                                adventure.
                            </p>
                        </div>

                        <span className="hotel-count">
                            {loading
                                ? "Loading..."
                                : `${filteredHotels.length} Hotels`}
                        </span>
                    </div>

                    {/* Loading */}
                    {loading ? (
                        <div className="empty-state">
                            <p>Loading hotels...</p>
                        </div>
                    ) : error ? (
                        /* API Error */
                        <div className="empty-state">
                            <h3>Unable to load hotels</h3>
                            <p>{error}</p>
                        </div>
                    ) : filteredHotels.length > 0 ? (
                        /* Hotel Cards */
                        <div className="hotel-grid">
                            {filteredHotels.map((hotel) => (
                                <HotelCard
                                    key={hotel._id}
                                    hotel={{
                                        ...hotel,
                                        id: hotel._id
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        /* No Hotels Found */
                        <div className="empty-state">
                            <Search size={36} />

                            <h3>
                                {hotels.length === 0
                                    ? "No hotels available"
                                    : "No hotels found"}
                            </h3>

                            <p>
                                {hotels.length === 0
                                    ? "Please add hotels to your database."
                                    : "Try searching for Bhopal, Goa, Jaipur or another city."}
                            </p>

                            {searchLocation && (
                                <button
                                    className="view-btn"
                                    onClick={() => {
                                        setLocation("");
                                        setSearchLocation("");
                                    }}
                                >
                                    Show All Hotels
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </main>

            {/* Footer */}
            <footer className="footer">
    <div className="footer-logo">
        <span className="footer-brand">🏨 HotelPro</span>
        <p>Find your stay. Make memories.</p>
    </div>

    <div className="footer-bottom">
        <small>
            © 2026 HotelPro. College Project.
        </small>
    </div>
</footer>
        </>
    );
}

