import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import socket from "../utils/websocket";
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const SensorChart = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: [
            { label: "Temperature (°C)", data: [], borderColor: "red", fill: false },
            { label: "Humidity (%)", data: [], borderColor: "blue", fill: false },
            { label: "Soil Moisture", data: [], borderColor: "green", fill: false }
        ],
    });

    useEffect(() => {
        socket.onmessage = (event) => {
            const sensorData = JSON.parse(event.data);
            setData((prev) => ({
                labels: [...prev.labels, new Date().toLocaleTimeString()].slice(-10),
                datasets: prev.datasets.map((dataset, index) => ({
                    ...dataset,
                    data: [...dataset.data, sensorData[index]].slice(-10)
                }))
            }));
        };
    }, []);

    return <Line data={data} />;
};

export default SensorChart;
