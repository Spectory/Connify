"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("http");
var express = require("express");
var router_1 = require("./config/router");
var socketIO = require("socket.io");
var path_1 = require("path");
var easyrtc = require("easyrtc");
var AppServer = (function () {
    function AppServer() {
        this.app = express();
        this.app.use(express.static(path_1.join(__dirname, "public")));
        this.app.get("/", function (request, response) {
            response.sendFile(path_1.join(__dirname, "public/index.html"));
        });
        this.app.use("/api", router_1.AppRouter);
        this.webServer = http_1.createServer(this.app);
        this.listen();
        console.log();
    }
    AppServer.prototype.listen = function () {
        this.webServer.listen(AppServer.PORT);
        this.socketServer = socketIO.listen(this.webServer);
        this.easyrtcServer = easyrtc.listen(this.app, this.socketServer, null, function (error, rtcRef) {
            console.log("RTC Server initiated!");
            rtcRef.events.on("roomCreate", function (appObj, creatorConnectionObj, roomName, roomOptions, callback) {
                console.log("roomCreate fired! creating room", roomName);
                appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
            });
        });
    };
    AppServer.PORT = process.env.PORT || 3000;
    return AppServer;
}());
exports.default = AppServer;
var server = new AppServer();
//# sourceMappingURL=server.js.map