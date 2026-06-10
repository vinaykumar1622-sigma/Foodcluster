import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { creatEditeShop, getMyShop } from "../controllers/shop.controller.js";
import { upload } from "../middlewares/multer.js";

const shopRouter = express.Router();

shopRouter.post("/create-edit", isAuth,upload.single("image"),creatEditeShop);
shopRouter.get("/get-my", isAuth,getMyShop);

export default shopRouter;
