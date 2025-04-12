// src/Components/ChatPage.jsx
import React from "react";
import ChatBot from "./ChatBot";

const ChatPage = () => {
    return (
        <div style={{ padding: "20px" }}>
            <h2>💬 AeroBot</h2>
            <ChatBot />
        </div>
    );
};

export default ChatPage;
