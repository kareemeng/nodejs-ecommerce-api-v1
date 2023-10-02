import { validatorMiddleware } from "../../middlewares/validatorMiddleware";
import { UserModel } from "../../models/UserModel";
import bcrypt from "bcrypt";
// check is used instead of param and body because it can be used in both cases
import { check } from "express-validator";

export const signupValidator = [
  check("name").notEmpty().withMessage("User name is required"),
  check("email")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (value, { req }) => {
      const user = await UserModel.find({ email: value });
      if (user.length > 0) {
        return Promise.reject("Email already in use");
      }
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  check("passwordConfirmation")
    .notEmpty()
    .withMessage("password confirmation is required")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  validatorMiddleware,
];
export const forgotPasswordValidator = [
  check("email").notEmpty().withMessage("email is required"),
  validatorMiddleware,
];
export const verifyResetTokenValidator = [
  check("email").notEmpty().withMessage("email is required"),
  check("resetToken")
    .notEmpty()
    .withMessage("resetToken is required")
    .isLength({ min: 6, max: 6 })
    .withMessage("resetToken must be 6 characters"),
  validatorMiddleware,
];
export const resetPasswordValidator = [
  check("email").notEmpty().withMessage("email is required"),
  check("newPassword")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  check("newPasswordConfirmation")
    .notEmpty()
    .withMessage("new password confirmation is required")
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.newPassword) {
        throw new Error("Password confirmation does not match password");
      }
      return true;
    }),
  validatorMiddleware,
];

export const loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format"),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters"),
  validatorMiddleware,
];

export default {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyResetTokenValidator,
  resetPasswordValidator,
};
