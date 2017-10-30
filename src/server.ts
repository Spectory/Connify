import { createServer, Server } from "http";
import * as express from "express";
import { Request, Response } from "express";
import { AppRouter } from "./config/router";
import * as socketIO from "socket.io";
import { join } from "path";
const easyrtc = require("easyrtc");

export default class AppServer {
  private static readonly PORT: string|number = process.env.PORT || 3000;
  private app: express.Application;
  private webServer: Server;
  private socketServer: any;
  private easyrtcServer: any; 
  constructor() {
    this.app = express();
    this.app.use(express.static(join(__dirname, "public")));
    this.app.get("/", (request: Request, response: Response) => {
      response.sendFile(join(__dirname, "public/index.html"));
    })
    this.app.use("/api", AppRouter);
    this.webServer = createServer(this.app);
    this.listen();
  }
  
  private listen(): void {
    this.webServer.listen(AppServer.PORT);
    this.socketServer = socketIO.listen(this.webServer);
    this.easyrtcServer = easyrtc.listen(this.app, this.socketServer, null, (error, rtcRef) => {
      console.log("RTC Server initiated!");
      rtcRef.events.on("roomCreate", (appObj, creatorConnectionObj, roomName, roomOptions, callback) => {
        console.log("roomCreate fired! creating room", roomName);
        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
      });
    });
  }
}

const server = new AppServer();