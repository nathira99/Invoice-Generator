import express from "express";

import {
    getDevices,
    removeDevice,
} from "../controllers/deviceController.js";

import { protect } from "../middleware/authMiddleware.js";

const router =
  express.Router();

router.get("/", protect, getDevices);

router.delete(
  "/:id",
  protect,
  removeDevice
);

export default router;