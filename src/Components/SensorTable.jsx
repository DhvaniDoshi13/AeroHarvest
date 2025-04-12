import React, { useState, useEffect } from "react";
import socket from "../utils/websocket";

const SensorTable = () => {
    const [rows, setRows] = useState([]);

    useEffect(() => {
        socket.onmessage = (event) => {
            const sensorData = JSON.parse(event.data);
            setRows((prev) => [
                { time: new Date().toLocaleTimeString(), temperature: sensorData[0], humidity: sensorData[1], moisture: sensorData[2] },
                ...prev.slice(0, 9)
            ]);
        };
    }, []);

    return (
        <table border="1">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Temperature (°C)</th>
                    <th>Humidity (%)</th>
                    <th>Soil Moisture</th>
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index}>
                        <td>{row.time}</td>
                        <td>{row.temperature}</td>
                        <td>{row.humidity}</td>
                        <td>{row.moisture}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default SensorTable;
