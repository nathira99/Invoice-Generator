import express from "express";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/studentController.js";

const router =
  express.Router();

/* GET + CREATE */

router
  .route("/")
  .get(getStudents)
  .post(createStudent);

/* UPDATE + DELETE */

router
  .route("/:id")
  .put(updateStudent)
  .delete(deleteStudent);

export default router;