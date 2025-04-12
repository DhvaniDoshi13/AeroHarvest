const WS_URL = "ws://localhost:5000";  // Backend WebSocket URL

const socket = new WebSocket(WS_URL);

socket.onopen = () => {
    console.log("Connected to WebSocket Server");
};

socket.onclose = () => {
    console.log("WebSocket Disconnected");
};

export default socket;
