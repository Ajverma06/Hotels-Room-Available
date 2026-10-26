
import axios from "axios";

const API = axios.create({
    baseURL: "https://hotels-room-available.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default API;

