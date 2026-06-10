import express from "express";
import { getcurrentUser } from "../controllers/user.controller.js";
import { isAuth } from "../middlewares/isAuth.js";

const userRouter = express.Router();

userRouter.get("/current",isAuth, getcurrentUser);

export default userRouter;
