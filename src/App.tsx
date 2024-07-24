import { useEffect, useState } from "react";

const App = () => {
  const [price, setPrice] = useState<number | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    // WebSocket connection setup
    const socket = new WebSocket("https://fast-state-squeaking.functions.on-fleek.app/");
    setWs(socket);

    // Fetch initial price from Chainlink oracle or API
    fetch("https://api.chain.link/price")
      .then((response) => response.json())
      .then((data) => {
        setPrice(data.price);
      })
      .catch((error) => console.error("Error fetching price:", error));

    // WebSocket event listeners
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "price_update") {
        setPrice(data.price);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup on component unmount
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        backgroundColor: "#f0f0f0",
        padding: "20px",
      }}
    >
      <h1 style={{ color: "#333" }}>Current Price</h1>
      <p style={{ fontSize: "18px" }}>
        {price !== null ? `${price} USD` : "Loading..."}
      </p>
    </div>
  );
};

export default App;
