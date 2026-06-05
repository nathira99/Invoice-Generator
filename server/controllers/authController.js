import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

import Device from "../models/deviceModel.js";

// LOGIN

export const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
        deviceId,
        deviceName,
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res
          .status(401)
          .json({
            message:
              "Invalid email",
          });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res
          .status(401)
          .json({
            message:
              "Invalid password",
          });

      }
      console.log("LOGIN BODY", {
  email,
  deviceId,
  deviceName,
});

try {
  const devices = await Device.find({
    userId: user._id,
  });


  const existingDevice =
    devices.find(
      (d) => d.deviceId === deviceId
    );

  if (existingDevice) {
    existingDevice.lastLogin =
      new Date();

    await existingDevice.save();
  } else {
    if (devices.length >= 10) {
      return res.status(403).json({
        message:
          "Maximum 10 devices reached.",
      });
    }

    await Device.create({
      userId: user._id,
      deviceId,
      deviceName,
    });
  }
} catch (err) {
  console.log(
    "DEVICE ERROR",
    err
  );
  throw err;
}

      const token =
        jwt.sign(
          {
            id: user._id,
            role: user.role,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

      res.cookie(
        "token",
        token,
        {
          httpOnly: true,
          secure: true,
          sameSite: "none",
        }
      );

      res.json({
        message:
          "Login successful",

        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

    } catch (error) {

      console.log(error);

      res
        .status(500)
        .json({
          message:
            "Server error",
        });

    }

  };


// LOGOUT

export const logoutUser =
  (req, res) => {

    res.cookie(
      "token",
      "",
      {
        httpOnly: true,
        expires:
          new Date(0),
      }
    );

    res.json({
      message:
        "Logged out",
    });

  };