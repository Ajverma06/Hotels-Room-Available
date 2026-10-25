const express = require("express");
const mongoose = require("mongoose");

const Hotel = require("../models/Hotel");
const User = require("../models/User");
const Booking = require("../models/Booking");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(adminMiddleware);

// Dashboard statistics
router.get("/stats", async (req, res) => {
    try {
        const [
            totalHotels,
            totalUsers,
            totalBookings,
            confirmedBookings,
            cancelledBookings,
            revenueResult
        ] = await Promise.all([
            Hotel.countDocuments(),
            User.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ status: "confirmed" }),
            Booking.countDocuments({ status: "cancelled" }),
            Booking.aggregate([
                { $match: { status: "confirmed" } },
                {
                    $group: {
                        _id: null,
                        total: { $sum: "$totalPrice" }
                    }
                }
            ])
        ]);

        res.json({
            success: true,
            stats: {
                totalHotels,
                totalUsers,
                totalBookings,
                confirmedBookings,
                cancelledBookings,
                revenue: revenueResult[0]?.total || 0
            }
        });
    } catch (error) {
        console.error("Admin stats error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load dashboard statistics"
        });
    }
});

// All hotels
router.get("/hotels", async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            count: hotels.length,
            hotels
        });
    } catch (error) {
        console.error("Fetch hotels error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch hotels"
        });
    }
});

// Add hotel
router.post("/hotels", async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Hotel added successfully",
            hotel
        });
    } catch (error) {
        console.error("Add hotel error:", error);

        res.status(400).json({
            success: false,
            message: "Unable to add hotel"
        });
    }
});

// Update hotel
router.put("/hotels/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel ID"
            });
        }

        const hotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        res.json({
            success: true,
            hotel
        });
    } catch (error) {
        console.error("Update hotel error:", error);

        res.status(400).json({
            success: false,
            message: "Unable to update hotel"
        });
    }
});

// Delete hotel
router.delete("/hotels/:id", async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel ID"
            });
        }

        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        const existingBookings = await Booking.exists({
            hotel: hotel._id,
            status: "confirmed"
        });

        if (existingBookings) {
            return res.status(409).json({
                success: false,
                message: "Cancel active bookings before deleting this hotel"
            });
        }

        await hotel.deleteOne();

        res.json({
            success: true,
            message: "Hotel deleted successfully"
        });
    } catch (error) {
        console.error("Delete hotel error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete hotel"
        });
    }
});

// All bookings
router.get("/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("user", "name email")
            .populate("hotel", "name location price")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            bookings
        });
    } catch (error) {
        console.error("Fetch bookings error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch bookings"
        });
    }
});

// All users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Fetch users error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch users"
        });
    }
});

module.exports = router;