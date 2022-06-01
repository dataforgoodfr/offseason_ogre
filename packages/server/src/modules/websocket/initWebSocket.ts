import { Express } from "express";
import { createServer } from "http";
import { Server } from "socket.io";

export { initWebSocket };

function initWebSocket({ app }: { app: Express }) {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    /* options */
  });

  io.on("connection", (socket) => {
    // eslint-disable-next-line no-console
    console.log("io connection");
    // ...
    console.log(socket.rooms); // Set { <socket.id> }
    socket.join("room1");
    console.log(socket.rooms); // Set { <socket.id>, "room1" }
  });
  return { httpServer };
}
