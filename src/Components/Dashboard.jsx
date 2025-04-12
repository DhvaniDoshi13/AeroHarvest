import React, { useEffect, useState, useMemo } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const [sensorData, setSensorData] = useState([]);

    useEffect(() => {
        const socket = new WebSocket("ws://localhost:5000");

        socket.onopen = () => console.log("✅ WebSocket Connected");

        socket.onmessage = (event) => {
            try {
                const newData = JSON.parse(event.data);
                console.log("📥 Received:", newData);

                const formattedData = {
                    Timestamp: newData.Timestamp || "N/A",
                    Temperature: parseFloat(newData.Temperature) || 0,
                    Humidity: parseFloat(newData.Humidity) || 0,
                    SoilMoisture: parseFloat(newData.SoilMoisture) || 0,
                    Toxicity: parseFloat(newData.Toxicity) || 0,
                };

                setSensorData((prevData) => {
                    if (prevData.length > 0 && JSON.stringify(prevData[prevData.length - 1]) === JSON.stringify(formattedData)) {
                        return prevData; 
                    }
                    return [...prevData.slice(-99), formattedData]; // Keep last 100 entries for stats
                });
            } catch (err) {
                console.error("❌ Error parsing WebSocket data:", err);
            }
        };

        socket.onerror = (err) => console.error("❌ WebSocket Error:", err);
        socket.onclose = () => console.log("⚠️ WebSocket Disconnected");

        return () => socket.close();
    }, []);

    const labels = sensorData.map((entry) => entry.Timestamp);
    const latestToxicity = sensorData.length > 0 ? sensorData[sensorData.length - 1].Toxicity : 0;

    // Compute daily and monthly averages
    const calculateAverage = (data, key) => (data.length ? (data.reduce((sum, entry) => sum + entry[key], 0) / data.length).toFixed(2) : "N/A");

    const dailyData = useMemo(() => sensorData.slice(-24), [sensorData]); // Assuming 24 readings per day
    const monthlyData = useMemo(() => sensorData.slice(-720), [sensorData]); // Assuming 30 days (24 * 30 = 720)

    const dailyStats = {
        Temperature: calculateAverage(dailyData, "Temperature"),
        Humidity: calculateAverage(dailyData, "Humidity"),
        SoilMoisture: calculateAverage(dailyData, "SoilMoisture"),
        Toxicity: calculateAverage(dailyData, "Toxicity"),
    };

    const monthlyStats = {
        Temperature: calculateAverage(monthlyData, "Temperature"),
        Humidity: calculateAverage(monthlyData, "Humidity"),
        SoilMoisture: calculateAverage(monthlyData, "SoilMoisture"),
        Toxicity: calculateAverage(monthlyData, "Toxicity"),
    };

    // Update Pie Chart for Toxicity
    const [pieData, setPieData] = useState({
        labels: ["Toxicity Level", "Safe Zone"],
        datasets: [{ data: [0, 100], backgroundColor: ["green", "lightgray"] }],
    });

    useEffect(() => {
        const toxicityColor = latestToxicity > 90 ? "red" : latestToxicity >= 70 ? "yellow" : "green";
        setPieData({
            labels: ["Toxicity Level", "Safe Zone"],
            datasets: [{ data: [latestToxicity, 100 - latestToxicity], backgroundColor: [toxicityColor, "lightgray"] }],
        });
    }, [latestToxicity]);

    const chartData = (label, data, color) => ({
        labels,
        datasets: [{ label, data, backgroundColor: color, borderColor: color, fill: false, tension: 0.3 }],
    });

    return (
        <div style={{ width: "80%", margin: "auto", textAlign: "center" }}>
            <h1>📊 Real-Time Sensor Data</h1>
    
            {/* Statistics Section */}
            <div style={{ display: "flex", justifyContent: "space-around", background: "#f4f4f4", padding: "10px", borderRadius: "10px", marginBottom: "10px" }}>
                <div>
                    <h3>📅 Daily Average</h3>
                    <p>🌡 Temperature: {dailyStats.Temperature}°C</p>
                    <p>💧 Humidity: {dailyStats.Humidity}%</p>
                    <p>🌱 Soil Moisture: {dailyStats.SoilMoisture}%</p>
                    <p>🛑 Toxicity: {dailyStats.Toxicity}%</p>
                </div>
                <div>
                    <h3>📆 Monthly Average</h3>
                    <p>🌡 Temperature: {monthlyStats.Temperature}°C</p>
                    <p>💧 Humidity: {monthlyStats.Humidity}%</p>
                    <p>🌱 Soil Moisture: {monthlyStats.SoilMoisture}%</p>
                    <p>🛑 Toxicity: {monthlyStats.Toxicity}%</p>
                </div>
            </div>
    
            {/* Bar Chart and Pie Chart Section */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
                {/* Bar Chart */}
                <div style={{ flex: 3, height: "400px" }}>
                    <Bar 
                        data={{ labels, datasets: [
                            { label: "Temperature (°C)", data: sensorData.map(e => e.Temperature), backgroundColor: "rgba(255, 99, 132, 0.6)" },
                            { label: "Humidity (%)", data: sensorData.map(e => e.Humidity), backgroundColor: "rgba(54, 162, 235, 0.6)" },
                            { label: "Soil Moisture (%)", data: sensorData.map(e => e.SoilMoisture), backgroundColor: "rgba(75, 192, 192, 0.6)" }
                        ]}} 
                    />
                </div>
    
                {/* Pie Chart */}
                <div style={{ flex: 1, height: "300px", width: "300px", textAlign: "center" ,marginTop:"0", marginBottom:"60px"}}>
                    <h4>🛑 Toxicity Level</h4>
                    <Pie data={pieData} />
                    <p>Current Toxicity: <strong style={{ color: pieData.datasets[0].backgroundColor[0] }}>{latestToxicity}%</strong></p>
                </div>
            </div>
    
            {/* Line Charts */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "30px" }}>
                <div><h4>🌡 Temperature</h4><Line data={chartData("Temperature", sensorData.map(e => e.Temperature), "red")} /></div>
                <div><h4>💧 Humidity</h4><Line data={chartData("Humidity", sensorData.map(e => e.Humidity), "blue")} /></div>
                <div><h4>🌱 Soil Moisture</h4><Line data={chartData("Soil Moisture", sensorData.map(e => e.SoilMoisture), "green")} /></div>
            </div>
        </div>
    );
    
};

export default Dashboard;