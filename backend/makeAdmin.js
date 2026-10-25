
require("dotenv").config();

const mongoose = require("mongoose");
const User = require("./models/User");

async function makeAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const user = await User.findById(
            "6addfa71cb126e873bc92d2c"
        );

        if (!user) {
            console.log("User not found!");
            return;
        }

        user.role = "admin";
        await user.save();

        console.log("Success! User role updated to:", user.role);
    } catch (error) {
        console.error("Error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

makeAdmin();

