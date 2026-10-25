const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const Hotel = require("../models/Hotel");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all hotels
router.get("/", async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: hotels.length,
            hotels
        });
    } catch (error) {
        console.error("Fetch hotels error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch hotels"
        });
    }
});

// Get single hotel by ID
router.get("/:id", async (req, res) => {
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

        return res.status(200).json({
            success: true,
            hotel
        });
    } catch (error) {
        console.error("Fetch hotel error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch hotel"
        });
    }
});

// Validate hotel data
function validateHotelData(data) {
    const { name, location, description, price, image } = data;

    if (
        typeof name !== "string" || !name.trim() ||
        typeof location !== "string" || !location.trim() ||
        typeof description !== "string" || !description.trim() ||
        typeof image !== "string" || !image.trim()
    ) {
        return "Name, location, description and image are required";
    }

    if (
        price === undefined ||
        price === null ||
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) <= 0
    ) {
        return "Price must be a positive number";
    }

    if (
        data.rating !== undefined &&
        data.rating !== "" &&
        (
            !Number.isFinite(Number(data.rating)) ||
            Number(data.rating) < 0 ||
            Number(data.rating) > 5
        )
    ) {
        return "Rating must be between 0 and 5";
    }

    if (
        data.amenities !== undefined &&
        !Array.isArray(data.amenities)
    ) {
        return "Amenities must be an array";
    }

    return null;
}

// Add a new hotel (admin only)
router.post("/", adminMiddleware, async (req, res) => {
    try {
        const validationError = validateHotelData(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const hotel = await Hotel.create({
            name: req.body.name.trim(),
            location: req.body.location.trim(),
            description: req.body.description.trim(),
            price: Number(req.body.price),
            rating:
                req.body.rating === undefined || req.body.rating === ""
                    ? 4.5
                    : Number(req.body.rating),
            image: req.body.image.trim(),
            amenities: (req.body.amenities || [])
                .map(item => String(item).trim())
                .filter(Boolean)
        });

        return res.status(201).json({
            success: true,
            message: "Hotel added successfully",
            hotel
        });
    } catch (error) {
        console.error("Add hotel error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to add hotel"
        });
    }
});

// Update a hotel (admin only)
router.put("/:id", adminMiddleware, async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid hotel ID"
            });
        }

        const validationError = validateHotelData(req.body);

        if (validationError) {
            return res.status(400).json({
                success: false,
                message: validationError
            });
        }

        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name.trim(),
                location: req.body.location.trim(),
                description: req.body.description.trim(),
                price: Number(req.body.price),
                rating:
                    req.body.rating === undefined || req.body.rating === ""
                        ? 4.5
                        : Number(req.body.rating),
                image: req.body.image.trim(),
                amenities: (req.body.amenities || [])
                    .map(item => String(item).trim())
                    .filter(Boolean)
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedHotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Hotel updated successfully",
            hotel: updatedHotel
        });
    } catch (error) {
        console.error("Update hotel error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update hotel"
        });
    }
});

// Delete a hotel (admin only)
router.delete("/:id", adminMiddleware, async (req, res) => {
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

        // Do not delete hotels with existing bookings.
        const Booking = require("../models/Booking");
        const hasBookings = await Booking.exists({ hotel: hotel._id });

        if (hasBookings) {
            return res.status(409).json({
                success: false,
                message: "This hotel has bookings and cannot be deleted"
            });
        }

        await hotel.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Hotel deleted successfully"
        });
    } catch (error) {
        console.error("Delete hotel error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete hotel"
        });
    }
});

module.exports = router;