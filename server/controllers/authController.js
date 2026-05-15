import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import User from "../models/userModel.js";


// LOGIN

export const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password,
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