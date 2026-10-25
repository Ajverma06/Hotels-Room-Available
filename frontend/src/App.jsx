
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";
import "./App.css";
import "./index.css";


function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/hotel/:id" element={<HotelDetails />} />
                <Route path="/my-bookings" element={<MyBookings />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

