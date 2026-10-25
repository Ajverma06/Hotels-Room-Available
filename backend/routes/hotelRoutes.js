const express = require("express");
const router = express.Router();
const Hotel = require("../models/Hotel");

// Get all hotels
router.get("/", async (req, res) => {
    try {
        const hotels = await Hotel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: hotels.length,
            hotels
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch hotels"
        });
    }
});

// Get single hotel by ID
router.get("/:id", async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Hotel not found"
            });
        }

        res.status(200).json({
            success: true,
            hotel
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Invalid hotel ID"
        });
    }
});

module.exports = router;