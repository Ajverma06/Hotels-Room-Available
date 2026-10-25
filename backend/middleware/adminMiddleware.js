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

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

console.log("Admin token verified. User ID:", decoded.userId);

const user = await User.findById(decoded.userId).select("-password");

console.log("Database user fetched:", Boolean(user));
console.log("User role:", user?.role);
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

        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
}

module.exports = adminMiddleware;