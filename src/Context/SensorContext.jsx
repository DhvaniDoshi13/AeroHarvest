import React, { createContext, useState, useEffect } from "react";

export const SensorContext = createContext();

const SensorProvider = ({ children }) => {
    const [sensorData, setSensorData] = useState([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000");

        socket.onmessage = (event) => {
            const newData = JSON.parse(event.data);
            setSensorData((prevData) => [...prevData, newData].slice(-100)); // Keep last 100 entries
        };

        return () => socket.close();
    }, []);

    return (
        <SensorContext.Provider value={{ sensorData, setSensorData }}>
            {children}
        </SensorContext.Provider>
    );
};

export default SensorProvider; // ✅ Ensure default export