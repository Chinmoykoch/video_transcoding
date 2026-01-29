import express, { Request, Response } from "express";
import { registerUser, loginUser } from "../user/user.controller";
import { verifyToken } from "../middleware/auth";
import { authorizeRoles } from "../middleware/role";

const router = express.Router();

// auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// // creator
// router.get("/creator", verifyToken, authorizeRoles("creator"));
// // user
// router.get("/normaluser", verifyToken, authorizeRoles("user"));
export default router;
