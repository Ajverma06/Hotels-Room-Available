
import { MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";

export default function HotelCard({ hotel }) {
  return (
    <div className="hotel-card">
      <div className="hotel-image-wrapper">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="hotel-image"
        />

        <span className="rating">
          <Star size={15} fill="currentColor" />
          {hotel.rating}
        </span>
      </div>

      <div className="hotel-info">
        <h3>{hotel.name}</h3>

        <p className="hotel-location">
          <MapPin size={16} />
          {hotel.location}
        </p>

        <div className="hotel-bottom">
          <div className="hotel-price">
            <strong>₹{hotel.price.toLocaleString("en-IN")}</strong>
            <span>/ night</span>
          </div>

          <Link
            to={`/hotel/${hotel.id}`}
            className="view-btn"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

