"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var IndexController = express_1.Router();
exports.IndexController = IndexController;
IndexController.get('/', function (req, res) {
    res.send('Hello, World!');
});
IndexController.get('/:name', function (req, res) {
    var name = req.params.name;
    res.send("Hi, " + name);
});
//# sourceMappingURL=indexController.js.map