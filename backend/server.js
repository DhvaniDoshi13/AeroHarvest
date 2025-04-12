require("dotenv").config();
const fs = require("fs");
const express = require("express");
const WebSocket = require("ws");
const path = require("path");
const http = require("http");
const cors = require("cors");
const chatRoute = require("./chat");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/chat", chatRoute);

// 👉 Create a single HTTP server for both Express & WebSocket
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 5000;

// ✅ Add this after all app.use(...)
const idealDataPath = path.join(__dirname, "crop_yield.csv");

app.get("/api/compare/:crop", (req, res) => {
    const crop = req.params.crop.toLowerCase();

    // Read ideal values
    const idealCSV = fs.readFileSync(idealDataPath, "utf8").split("\n");
    const headers = idealCSV[0].split(",").map(h => h.trim());
    const rows = idealCSV.slice(1);

    const match = rows.find(row => row && row.toLowerCase().includes(crop));
    if (!match) return res.status(404).json({ error: "Crop not found" });

    const matchData = match.split(",");
    const fullIdealValues = headers.reduce((obj, key, idx) => {
        obj[key] = matchData[idx] || "N/A";
        return obj;
    }, {});

    // ❌ Remove unwanted fields from ideal
    const { Fertilizer_Used, Irrigation_Used, Weather_Condition, ...filteredIdeal } = fullIdealValues;

    // ✅ Rename keys
    const renameMap = {
        Temperature_Celsius: "Temperature (°C)",
        Rainfall_mm: "Rainfall (mm)",
        Days_to_Harvest: "Harvest Days",
        Yield_tons_per_hectare: "Yield (tons/ha)"
    };

    const renamedIdeal = Object.entries(filteredIdeal).reduce((obj, [key, val]) => {
        const newKey = renameMap[key] || key;
        const num = parseFloat(val);
        obj[newKey] = !isNaN(num) ? Number(num.toFixed(2)) : val;
        return obj;
    }, {});

    // 🛰️ Get all observed values
    const observed = readLatestCSVRow();

    return res.json({ idealValues: renamedIdeal, observed });
});

server.listen(PORT, () => {
    console.log(`🚀 Server with API & WebSocket running on http://localhost:${PORT}`);
});

// 🔥 Function to read the latest row from CSV
function readLatestCSVRow() {
    const filePath = path.join(__dirname, "sensor_data.csv");

    try {
        const data = fs.readFileSync(filePath, "utf8");
        const lines = data.trim().split("\n");

        if (lines.length < 2) {
            console.warn("⚠️ CSV file is empty or only has headers!");
            return null;
        }

        const headers = lines[0].split(",").map(h => h.trim());
        const lastRow = lines[lines.length - 1].split(",").map(v => v.trim());

        if (headers.length !== lastRow.length) {
            console.error("❌ Header and row length mismatch");
            return null;
        }

        const latestData = headers.reduce((obj, key, idx) => {
            obj[key] = lastRow[idx] || "N/A";
            return obj;
        }, {});

        if (latestData["Time"]) {
            latestData["Timestamp"] = latestData["Time"];
            delete latestData["Time"];
        }

        return latestData;
    } catch (err) {
        console.error("❌ Error reading CSV:", err);
        return null;
    }
}

// 🔄 Broadcast data to all clients every 10 seconds
setInterval(() => {
    const latestData = readLatestCSVRow();
    if (latestData) {
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(latestData));
            }
        });
    }
}, 10000);

// 🌐 Handle WebSocket connections
wss.on("connection", (ws) => {
    console.log("🔗 WebSocket client connected");

    ws.on("close", () => {
        console.log("❌ Client disconnected");
    });
});
