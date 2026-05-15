import mongoose from "mongoose";

import bcrypt from "bcryptjs";

import dotenv from "dotenv";

import User from "./models/userModel.js";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const createAdmin =
  async () => {

    const hashedPassword =
      await bcrypt.hash(
        "ijnotion1997",
        10
      );

    await User.create({
      name: "Admin",
      email:
        "ilmuljannahnotion@gmail.com",
      password:
        hashedPassword,
      role: "admin",
    });

    console.log(
      "Admin created"
    );

    process.exit();

  };

createAdmin();