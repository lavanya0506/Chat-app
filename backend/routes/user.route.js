import express from "express";
import { getUsersSidebar } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get('/',protectRoute, getUsersSidebar)

export default router