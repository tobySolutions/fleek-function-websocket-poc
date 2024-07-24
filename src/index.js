class Deferred {
  resolve;
  reject;
  inner;
  constructor() {
    this.inner = new Promise((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export const main = async () => {
  let promise = new Deferred();
  const messages = [];

  const socket = new WebSocket(
    "wss://api.chain.link/ws"
  );

  // Connection opened -> Subscribe
  socket.onopen = function (event) {
    console.log("Subscribing to AAPL, BINANCE:BTCUSDT, IC MARKETS:1");
    // Subscribe to AAPL
    socket.send(JSON.stringify({ type: "subscribe", symbol: "AAPL" }));
    // Subscribe to BINANCE:BTCUSDT
    socket.send(
      JSON.stringify({ type: "subscribe", symbol: "BINANCE:BTCUSDT" })
    );
    // Subscribe to IC MARKETS:1
    socket.send(JSON.stringify({ type: "subscribe", symbol: "IC MARKETS:1" }));
  };

  // Listen for messages
  socket.onmessage = function (event) {
    messages.push(JSON.parse(event.data));
    socket.close();
  };

  // Handle errors
  socket.onerror = function (event) {
    messages.push("WebSocket error: " + event);
    promise.reject();
  };

  // Handle connection close
  socket.onclose = function (event) {
    messages.push("WebSocket connection closed");
    promise.resolve();
  };

  await promise.inner;

  return messages;
};
