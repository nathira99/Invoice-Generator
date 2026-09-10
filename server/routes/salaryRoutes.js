import express from "express";

import {
  generateSalaryNumber,
  getSalaries,
  getSalaryById,
  createSalary,
  updateSalary,
  deleteSalary,
  restoreSalary,
  permanentlyDeleteSalary,
} from "../controllers/salaryController.js";

const router = express.Router();

/* ================================
   SALARY NUMBER
================================ */

router.get("/generate-number", generateSalaryNumber);

/* ================================
   SALARIES
================================ */

// Get all salaries
router.get("/", getSalaries);

// Get single salary
router.get("/:id", getSalaryById);

// Create salary
router.post("/", createSalary);

// Update salary
router.put("/:id", updateSalary);

// Soft delete
router.delete("/:id", deleteSalary);

// Restore
router.patch("/:id/restore", restoreSalary);

// Permanent delete
router.delete("/:id/permanent", permanentlyDeleteSalary);

export default router;