
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();


app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://hotels-room-available-1.onrender.com"
    ]
}));



app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "HotelPro Backend is Running!"
    });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/hotels", require("./routes/hotelRoutes"));
app.use("/api/bookings", bookingRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing from environment variables");
        }

        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 10000
        });

        console.log("MongoDB Connected Successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Startup Error:", error.message);
        process.exit(1);
    }
}

startServer();

