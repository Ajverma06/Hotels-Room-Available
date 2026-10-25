const express = require("express");
const mongoose = require("mongoose");

const Booking = require("../models/Booking");
const Hotel = require("../models/Hotel");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new booking
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { hotelId, checkIn, checkOut, guests } = req.body;

        if (!hotelId || !checkIn || !checkOut || guests == null) {
            return res.status(400).json({
                success: false,
                message: "All booking fields are required"
            });
        }

        if (!mongoose.isValidObjectId(hotelId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel ID"
            });
        }

        const numberOfGuests = Number(guests);

        if (!Number.isInteger(numberOfGuests) || numberOfGuests < 1) {
            return res.status(400).json({
                success: false,
                message: "Guests must be a positive whole number"
            });
        }

        const startDate = new Date(checkIn);
        const endDate = new Date(checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (
            Number.isNaN(startDate.getTime()) ||
            Number.isNaN(endDate.getTime())
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking dates"
            });
        }

        if (startDate < today || endDate <= startDate) {
            return res.status(400).json({
                success: false,
                message: "Please select valid check-in and check-out dates"
            });
        }

        const hotel = await Hotel.findById(hotelId);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        const millisecondsPerDay = 1000 * 60 * 60 * 24;

        const nights = Math.ceil(
            (Date.UTC(
                endDate.getUTCFullYear(),
                endDate.getUTCMonth(),
                endDate.getUTCDate()
            ) -
                Date.UTC(
                    startDate.getUTCFullYear(),
                    startDate.getUTCMonth(),
                    startDate.getUTCDate()
                )) / millisecondsPerDay
        );

        const totalPrice = nights * hotel.price;

        const booking = await Booking.create({
            user: req.user._id,
            hotel: hotel._id,
            checkIn: startDate,
            checkOut: endDate,
            guests: numberOfGuests,
            totalPrice
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate("hotel")
            .populate("user", "name email");

        return res.status(201).json({
            success: true,
            message: "Hotel booked successfully",
            booking: populatedBooking
        });
    } catch (error) {
        console.error("Create booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to create booking"
        });
    }
});

// Get bookings of the logged-in user
router.get("/my-bookings", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        })
            .populate("hotel")
            .sort({ createdAt: -1 });

        return res.json({
            success: true,
            count: bookings.length,
            bookings
        });
    } catch (error) {
        console.error("Fetch bookings error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch bookings"
        });
    }
});

// Cancel a booking belonging to the logged-in user
router.patch("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID"
            });
        }

        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled"
            });
        }

        booking.status = "cancelled";
        await booking.save();

        return res.json({
            success: true,
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        console.error("Cancel booking error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to cancel booking"
        });
    }
});

module.exports = router;