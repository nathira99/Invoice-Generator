import express from "express";

import {
  getStaffs,
  createStaff,
  updateStaff,
  deleteStaff,
} from "../controllers/staffController.js";

const router =
  express.Router();

router
  .route("/")
  .get(getStaffs)
  .post(createStaff);

router
  .route("/:id")
  .put(updateStaff)
  .delete(deleteStaff);

export default router;