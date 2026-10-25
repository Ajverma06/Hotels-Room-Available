import axios from "axios";

const API = axios.create({
    baseURL: "https://hotels-room-available.onrender.com/api"
});

export default API;