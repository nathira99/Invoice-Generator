import express from "express";

import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  syncAllStudents,
} from "../controllers/studentController.js";

const router =
  express.Router();

  
/* SYNC ALL STUDENTS */

router.post("/sync-all", syncAllStudents);


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