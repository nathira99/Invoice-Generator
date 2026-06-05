import bcrypt from "bcryptjs";

import dotenv from "dotenv";

import User from "./models/userModel.js";

import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const createAdmin = async () => {

  try {

    const existingAdmin =
      await User.findOne({
        email:
          process.env.ADMIN_EMAIL,
      });

    if (existingAdmin) {

      console.log(
        "Admin already exists"
      );

      process.exit();

    }

    const hashedPassword =
      await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

    const admin =
      await User.create({
        name: "Admin",
        email:
          process.env.ADMIN_EMAIL,

        password:
          hashedPassword,

        role: "admin",
      });

    console.log(
      "Admin created successfully"
    );

    console.log(admin);

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);

  }

};

createAdmin();