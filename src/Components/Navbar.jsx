import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{ background: "#333", padding: "10px", display: "flex", gap: "20px" }}>
            <Link to="/home" style={{ color: "white", textDecoration: "none" }}>🏠 Home</Link>
            <Link to="/dashboard" style={{ color: "white", textDecoration: "none" }}>📊 Dashboard</Link>
            <Link to="/weather-report" style={{ color: "white", textDecoration: "none" }}>🌦 Weather Report</Link>
            <Link to="/chatbot" style={{ color: "white", textDecoration: "none" }}>💬 ChatBot</Link>

        </nav>
    );
};

export default Navbar;
