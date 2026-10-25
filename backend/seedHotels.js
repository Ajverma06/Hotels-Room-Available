const mongoose = require("mongoose");
require("dotenv").config();

const Hotel = require("./models/Hotel");

const hotels = [
    {
        name: "The Grand Palace",
        location: "Bhopal, Madhya Pradesh",
        description: "A comfortable luxury hotel with modern rooms and excellent service.",
        price: 3500,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        amenities: ["WiFi", "Swimming Pool", "Restaurant", "AC"]
    },
    {
        name: "Royal Orchid",
        location: "Indore, Madhya Pradesh",
        description: "Enjoy a relaxing stay with spacious rooms and delicious food.",
        price: 2800,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
        amenities: ["WiFi", "Restaurant", "Parking", "AC"]
    },
    {
        name: "Pink City Resort",
        location: "Jaipur, Rajasthan",
        description: "Experience traditional hospitality with beautiful interiors.",
        price: 4200,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd",
        amenities: ["WiFi", "Swimming Pool", "Spa", "Restaurant"]
    },
    {
        name: "Sea View Hotel",
        location: "Goa, India",
        description: "A peaceful getaway near beautiful beaches.",
        price: 5000,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
        amenities: ["WiFi", "Beach Access", "Swimming Pool", "AC"]
    },
    {
        name: "Mountain Escape",
        location: "Manali, Himachal Pradesh",
        description: "Enjoy mountain views and a comfortable stay surrounded by nature.",
        price: 3200,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59",
        amenities: ["WiFi", "Mountain View", "Restaurant", "Parking"]
    },
    {
        name: "Capital Comfort",
        location: "New Delhi, India",
        description: "A modern hotel suitable for business trips and family vacations.",
        price: 3900,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
        amenities: ["WiFi", "Restaurant", "Gym", "AC"]
    }
];

async function seedHotels() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Existing hotels ko delete kiye bina sample hotels add karo.
        for (const hotelData of hotels) {
            await Hotel.updateOne(
                {
                    name: hotelData.name,
                    location: hotelData.location
                },
                {
                    $set: hotelData
                },
                {
                    upsert: true
                }
            );
        }

        console.log("Sample hotels added successfully!");
        console.log(`Total sample hotels processed: ${hotels.length}`);
    } catch (error) {
        console.error("Error adding hotels:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
}

seedHotels();