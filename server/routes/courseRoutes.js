import express from "express";

import {
  getCourses,
  createCourse,
  updateCourse,
  duplicateCourse,
  deleteCourse,
  syncAllCourses,
} from "../controllers/courseController.js";

const router =
  express.Router();

/* GET + CREATE */

router
  .route("/")
  .get(getCourses)
  .post(createCourse);

/* SYNC ALL COURSES */

router.get("/sync-all", syncAllCourses);

/* UPDATE + DELETE */

router
  .route("/:id")
  .put(updateCourse)
  .post(duplicateCourse)
  .delete(deleteCourse);


export default router;