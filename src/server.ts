import * as http from "http";
import * as https from "https";
import * as express from "express";
import { Request, Response } from "express";
import { AppRouter } from "./config/router";
import * as socketIO from "socket.io";
import { join } from "path";
import * as fs from "fs";
import * as sslHerokuRedirect from "heroku-ssl-redirect"
const easyrtc = require("easyrtc");

export default class AppServer {
  private static readonly PORT: string|number = process.env.PORT || 3000;
  private app: express.Application;
  private webServer: any;
  private socketServer: any;
  private easyrtcServer: any; 
  private privateKey: string;
  private privateCrt: string;

  constructor() {
    this.privateKey = fs.readFileSync(join(__dirname, "certs", "host.key")).toString();
    this.privateCrt = fs.readFileSync(join(__dirname, "certs", "host.cert")).toString();
    
    this.app = express();
    this.app.use(express.static(join(__dirname, "public")));
    this.app.get("/", (request: Request, response: Response) => {
      response.sendFile(join(__dirname, "public/index.html"));
    })
    let options = {};
    this.app.use("/api", AppRouter);
    if (process.env.NODE_ENV === "production") {
      this.webServer = http.createServer(this.app);
    } else {
      this.webServer = https.createServer({ key: this.privateKey, cert: this.privateCrt }, this.app);
    }
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