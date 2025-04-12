import React, { useState } from "react";

const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages([...messages, userMessage]);
        setInput("");

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();
            const botMessage = { sender: "bot", text: data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (err) {
            console.error("❌ Error:", err);
        }
    };

    const containerStyle = {
        width: "400px",
        margin: "30px auto",
        border: "1px solid #ddd",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#fff"
    };

    const chatBoxStyle = {
        maxHeight: "300px",
        overflowY: "auto",
        marginBottom: "15px",
        padding: "10px",
        border: "1px solid #eee",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9"
    };

    const messageStyle = (sender) => ({
        textAlign: sender === "user" ? "right" : "left",
        marginBottom: "10px"
    });

    const bubbleStyle = (sender) => ({
        display: "inline-block",
        padding: "10px 15px",
        borderRadius: "20px",
        maxWidth: "75%",
        backgroundColor: sender === "user" ? "#d1e7dd" : "#e2e3e5",
        color: "#000"
    });

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🤖 Chat with AeroBot</h2>
            <div style={chatBoxStyle}>
                {messages.map((msg, index) => (
                    <div key={index} style={messageStyle(msg.sender)}>
                        <div style={bubbleStyle(msg.sender)}>
                            <strong>{msg.sender === "user" ? "You" : "Bot"}:</strong> {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    marginBottom: "10px",
                    boxSizing: "border-box"
                }}
            />
            <button
                onClick={sendMessage}
                style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "10px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold"
                }}
            >
                Send
            </button>
        </div>
    );
};

export default ChatBot;
