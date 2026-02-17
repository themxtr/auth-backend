import dotenv from "dotenv";
dotenv.config();

import { Request, Response } from "express";
import {db} from "../config/firebase";
import { User } from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not defined in environment variables");
}


// ====================== SIGNUP ======================
export const signupUser = async (
  req: Request<{}, {}, User>,
  res: Response
) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existingUser = await db.collection("users").doc(email).get();
    if (existingUser.exists) {
      return res.status(409).json({ message: "User already exists" });
    }

    // 🔐 Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.collection("users").doc(email).set({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ====================== LOGIN ======================
export const loginUser = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response
) => {
  try {
    const { email, password } = req.body;

    const userDoc = await db.collection("users").doc(email).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data() as User;

    // 🔐 Compare hashed password
    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔑 Generate JWT Token
    const token = jwt.sign(
      { email: userData.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// ====================== GET USER (Protected) ======================
export const getUser = async (req: Request, res: Response) => {
  try {
    const email = (req as any).user.email;

    const userDoc = await db.collection("users").doc(email).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = userDoc.data();

    if (!userData) {
    return res.status(404).json({ message: "User not found" });
    }
    delete userData.password;
    // Convert Firestore timestamp to ISO string
    if (userData.createdAt?.toDate) {
    userData.createdAt = userData.createdAt.toDate().toISOString();
    }
    return res.status(200).json(userData);

  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  return res.status(200).json({ message: "Logged out successfully" });
};
