import React, { useState } from "react";
import axios from "axios";

const CompareCrop = () => {
    const [crop, setCrop] = useState("");
    const [data, setData] = useState(null);
    const [error, setError] = useState("");

    const fetchComparison = async () => {
        try {
            setError("");
            const res = await axios.get(`http://localhost:5000/api/compare/${crop}`);
            setData(res.data);
        } catch (err) {
            console.error("❌ Fetch error:", err);
            setError("Crop not found or server error.");
            setData(null);
        }
    };

    return (
        <div style={{ padding: "40px", maxWidth: "900px", margin: "auto", fontFamily: "Arial, sans-serif" }}>
            <h2 style={{ textAlign: "center", marginBottom: "30px" }}>🌿 Crop Condition Comparison</h2>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Enter crop name (e.g., rice)"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    style={{
                        padding: "12px",
                        width: "300px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                        fontSize: "16px"
                    }}
                />
                <button
                    onClick={fetchComparison}
                    style={{
                        padding: "12px 20px",
                        backgroundColor: "#4CAF50",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontSize: "16px"
                    }}
                >
                    Compare
                </button>
            </div>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            {data && (
                <div style={{ display: "flex", gap: "20px", marginTop: "30px", flexWrap: "wrap", justifyContent: "center" }}>
                    {/* Ideal Values Card */}
                    <div style={{ flex: "1", minWidth: "300px", backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
                        <h3 style={{ borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>✅ Ideal Values</h3>
                        <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                            {Object.entries(data.idealValues).map(([key, value]) => (
                                <li key={key} style={{ marginBottom: "8px" }}>
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Observed Values Card */}
                    <div style={{ flex: "1", minWidth: "300px", backgroundColor: "#eef6ff", padding: "20px", borderRadius: "8px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
                        <h3 style={{ borderBottom: "2px solid #ccc", paddingBottom: "5px" }}>📡 Observed (Sensor) Values</h3>
                        <ul style={{ listStyle: "none", paddingLeft: "0" }}>
                            {Object.entries(data.observed).map(([key, value]) => (
                                <li key={key} style={{ marginBottom: "8px" }}>
                                    <strong>{key}:</strong> {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompareCrop;
