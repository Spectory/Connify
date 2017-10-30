"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var indexController_1 = require("../controllers/indexController");
var AppRouter = express_1.Router();
exports.AppRouter = AppRouter;
AppRouter.use("/welcome", indexController_1.IndexController);
//# sourceMappingURL=router.js.map