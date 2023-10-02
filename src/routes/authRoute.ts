import express from "express";
import {
  signup,
  login,
  forgotPassword,
  verifyPasswordResetToken,
  resetPassword,
} from "../services/authServices";
import {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetTokenValidator,
  resetPasswordValidator,
} from "../utils/validators/authValidator";
const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);
router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);
router.post(
  "/verifyResetToken",
  verifyResetTokenValidator,
  verifyPasswordResetToken
);
router.put("/resetPassword", resetPasswordValidator, resetPassword);
export default router;
