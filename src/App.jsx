import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./Components/Dashboard";
import WeatherReport from "./Components/WeatherReport";
import ChatPage from "./Components/ChatPage";
import HomePage from "./Components//HomePage";

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="home" element={<HomePage />}/>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/weather-report" element={<WeatherReport />} />
                <Route path="*" element={<Dashboard />} />
                <Route path="/chatbot" element={<ChatPage />} />
            </Routes>
        </Router>
    );
};

export default App;
