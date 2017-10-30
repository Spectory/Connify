import { Router } from "express";
import { IndexController } from "../controllers/indexController";

const AppRouter : Router = Router();

AppRouter.use("/welcome", IndexController);

export { AppRouter }