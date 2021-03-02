import express from "express";
import * as http from "http";
import { Server, Socket } from "socket.io";

export class SocketServer {

  // Server
  public static readonly PORT: number = 8080;
  private app: express.Application;
  private server: http.Server;
  private io: Server;
  private port: string | number;

  constructor() {
    this.app = express();
    this.createServer();
    this.sockets();
  }

  private createServer(): void {
    this.server = require("http").Server(this.app);
    this.port = process.env.PORT || 3500;
  }

  private sockets(): void {
    this.io = new Server(this.server, {
      cors: {
        origin: "*",
      }
    });

    this.io.on("connect", (socket: Socket) => {

      socket.on("my_socket_event", () => {
        console.log("My socket event")
      });

      socket.on("disconnect", () => {
        console.log("Client Disconnected")
      });

    });

    this.server.listen(this.port, () => {
      console.log("Running server on port %s, env %s", this.port, this.app.get("env"));
    });
  }

  public getApp(): express.Application {
    return this.app;
  }
}

const expressApp = new SocketServer().getApp();