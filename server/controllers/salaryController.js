import Salary from "../models/salary.js";
import Teacher from "../models/teacherModel.js";
import Staff from "../models/staffModel.js";

/* ================================
   GENERATE SALARY NUMBER
================================ */

export const generateSalaryNumber = async (req, res) => {
  try {
    const lastSalary = await Salary.findOne()
      .sort({ createdAt: -1 })
      .select("salaryNumber");

    let nextNumber = 1;

    if (lastSalary?.salaryNumber) {
      const match = lastSalary.salaryNumber.match(/\d+$/);

      if (match) {
        nextNumber = Number(match[0]) + 1;
      }
    }

    const salaryNumber = `SAL-${String(nextNumber).padStart(4, "0")}`;

    res.status(200).json({
      success: true,
      salaryNumber,
    });
  } catch (error) {
    console.error("Generate salary number error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate salary number",
    });
  }
};

/* ================================
   GET ALL SALARIES
================================ */

export const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find({
      isDeleted: false,
    }).sort({ salaryDate: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      salaries,
    });
  } catch (error) {
    console.error("Get salaries error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch salaries",
    });
  }
};

/* ================================
   GET SINGLE SALARY
================================ */

export const getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);

    if (!salary || salary.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Salary not found",
      });
    }

    res.status(200).json({
      success: true,
      salary,
    });
  } catch (error) {
    console.error("Get salary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch salary",
    });
  }
};

/* ================================
   CREATE SALARY
================================ */

export const createSalary = async (req, res) => {
  try {
    const {
      salaryNumber,
      employeeName,
      employeeType,
      role,
      salaryMonth,
      salaryDate,
      basicSalary,
      bonus,
      deduction,
      paymentMethod,
      status,
      notes,
    } = req.body;

    /* CHECK EMPLOYEE */

    let employee = null;

    if (employeeType === "Teacher") {
      employee = await Teacher.findOne({
        teacherName: employeeName,
        status: "Active",
      });
    }

    if (employeeType === "Staff") {
      employee = await Staff.findOne({
        name: employeeName,
        status: "Active",
      });
    }

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: "Selected employee was not found or is inactive",
      });
    }

    /* CHECK DUPLICATE */

    const existingSalary = await Salary.findOne({
      employeeName: employeeName.trim(),
      employeeType,
      salaryMonth: salaryMonth.trim(),
      isDeleted: false,
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: `${employeeName} already has a salary record for ${salaryMonth}`,
      });
    }

    /* CALCULATE NET SALARY */

    const basic = Number(basicSalary) || 0;
    const bonusAmount = Number(bonus) || 0;
    const deductionAmount = Number(deduction) || 0;

    const netSalary = Math.max(
      0,
      basic + bonusAmount - deductionAmount,
    );

    const salary = await Salary.create({
      salaryNumber,
      employeeName: employeeName.trim(),
      employeeType,
      role: role?.trim() || "",
      salaryMonth: salaryMonth.trim(),
      salaryDate: salaryDate || new Date(),
      basicSalary: basic,
      bonus: bonusAmount,
      deduction: deductionAmount,
      netSalary,
      paymentMethod: paymentMethod || "Cash",
      status: status || "Pending",
      notes: notes?.trim() || "",
    });

    res.status(201).json({
      success: true,
      message: "Salary created successfully",
      salary,
    });
  } catch (error) {
    console.error("Create salary error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to create salary",
    });
  }
};

/* ================================
   UPDATE SALARY
================================ */

export const updateSalary = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employeeName,
      employeeType,
      role,
      salaryMonth,
      salaryDate,
      basicSalary,
      bonus,
      deduction,
      paymentMethod,
      status,
      notes,
    } = req.body;

    const salary = await Salary.findById(id);

    if (!salary || salary.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Salary not found",
      });
    }

    /* CHECK DUPLICATE */

    const existingSalary = await Salary.findOne({
      _id: { $ne: id },
      employeeName: employeeName.trim(),
      employeeType,
      salaryMonth: salaryMonth.trim(),
      isDeleted: false,
    });

    if (existingSalary) {
      return res.status(400).json({
        success: false,
        message: `${employeeName} already has a salary record for ${salaryMonth}`,
      });
    }

    /* CALCULATE NET SALARY */

    const basic = Number(basicSalary) || 0;
    const bonusAmount = Number(bonus) || 0;
    const deductionAmount = Number(deduction) || 0;

    const netSalary = Math.max(
      0,
      basic + bonusAmount - deductionAmount,
    );

    salary.employeeName = employeeName.trim();
    salary.employeeType = employeeType;
    salary.role = role?.trim() || "";
    salary.salaryMonth = salaryMonth.trim();
    salary.salaryDate = salaryDate || salary.salaryDate;
    salary.basicSalary = basic;
    salary.bonus = bonusAmount;
    salary.deduction = deductionAmount;
    salary.netSalary = netSalary;
    salary.paymentMethod = paymentMethod || "Cash";
    salary.status = status || "Pending";
    salary.notes = notes?.trim() || "";

    await salary.save();

    res.status(200).json({
      success: true,
      message: "Salary updated successfully",
      salary,
    });
  } catch (error) {
    console.error("Update salary error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Failed to update salary",
    });
  }
};

/* ================================
   SOFT DELETE SALARY
================================ */

export const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary not found",
      });
    }

    salary.isDeleted = true;
    salary.deletedAt = new Date();

    await salary.save();

    res.status(200).json({
      success: true,
      message: "Salary deleted successfully",
    });
  } catch (error) {
    console.error("Delete salary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete salary",
    });
  }
};

/* ================================
   RESTORE SALARY
================================ */

export const restoreSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary not found",
      });
    }

    salary.isDeleted = false;
    salary.deletedAt = null;

    await salary.save();

    res.status(200).json({
      success: true,
      message: "Salary restored successfully",
      salary,
    });
  } catch (error) {
    console.error("Restore salary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to restore salary",
    });
  }
};

/* ================================
   PERMANENT DELETE SALARY
================================ */

export const permanentlyDeleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);

    if (!salary) {
      return res.status(404).json({
        success: false,
        message: "Salary not found",
      });
    }

    await Salary.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Salary permanently deleted",
    });
  } catch (error) {
    console.error("Permanent delete salary error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to permanently delete salary",
    });
  }
};