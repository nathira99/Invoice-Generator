import express from "express";

import {
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router =
  express.Router();

/* GET + CREATE */

router
  .route("/")
  .get(getTeachers)
  .post(createTeacher);

/* UPDATE + DELETE */

router
  .route("/:id")
  .put(updateTeacher)
  .delete(deleteTeacher);

export default router;