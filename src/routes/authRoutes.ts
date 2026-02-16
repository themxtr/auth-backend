import { Router } from "express";
import {
  signupUser,
  loginUser,
  getUser,
  logoutUser,
} from "../controllers/authController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);
router.get("/me", verifyToken, getUser);   // Protected route
router.post("/logout", logoutUser);

export default router;
