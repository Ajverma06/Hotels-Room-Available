require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

async function makeAdmin() {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is missing in backend/.env");
        }

        await mongoose.connect(process.env.MONGO_URI);

        // Yahan signup karte waqt use kiya hua apna email likho.
        const email = "your-email@example.com".trim().toLowerCase();

        const user = await User.findOne({ email });

        if (!user) {
            console.log("User not found. Please signup first.");
            return;
        }

        user.role = "admin";
        await user.save();

        console.log("Admin role assigned successfully!");
        console.log("Email:", user.email);
        console.log("Role:", user.role);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

makeAdmin();