import bcrypt from "bcryptjs";
import userModel from "./user.model";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    //existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create new user
    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // save user
    await user.save();

    res.status(201).json({
      sucess: true,
      message: `User registered with email ${email}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const User = await userModel.findOne({ email });

    // check user registered
    if (!User) {
      return res.status(404).json({
        success: false,
        message: `User with email ${email} not found`,
      });
    }

    // password validation
    const isMatched = await bcrypt.compare(password, User.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: `Invalid credential`,
      });
    }

    // generate token
    const token = jwt.sign(
      {
        id: User._id.toString(),
        role: User.role,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
        success: true,
        message: `User with logged in successfully`,
        token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
        message: "internal server error",
    });
  }
};

