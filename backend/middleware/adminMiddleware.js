const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function adminMiddleware(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Please login first"
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing");

            return res.status(500).json({
                success: false,
                message: "Server authentication configuration error"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token payload"
            });
        }

        const user = await User.findById(decoded.userId)
            .select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Admin access required"
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.error("Admin authentication error:", error.message);

        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError"
        ) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Admin authentication failed"
        });
    }
}

module.exports = adminMiddleware;