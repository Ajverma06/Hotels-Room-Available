import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HotelDetails from "./pages/HotelDetails";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AllHotels from "./pages/AllHotels";
import AddHotel from "./pages/AddHotel";
import AllBookings from "./pages/AllBookings";
import AllUsers from "./pages/AllUsers";
import EditHotel from "./pages/EditHotel";

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
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/hotels" element={<AllHotels />} />
                <Route path="/admin/add-hotel" element={<AddHotel />} />
                <Route path="/admin/bookings" element={<AllBookings />} />
                <Route path="/admin/users" element={<AllUsers />} />
                <Route path="/admin/hotels/edit/:id" element={<EditHotel />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;