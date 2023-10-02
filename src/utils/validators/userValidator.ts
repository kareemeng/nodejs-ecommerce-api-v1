import { validatorMiddleware } from "../../middlewares/validatorMiddleware";
import { UserModel } from "../../models/UserModel";
import bcrypt from "bcrypt";
// check is used instead of param and body because it can be used in both cases
import { check } from "express-validator";
export const getUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("invalid User id format"),
  validatorMiddleware,
];

export const createUserValidator = [
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
  check("phone")
    .optional()
    //ar-EG for Egypt, ar-SA for Saudi Arabia
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number format"),
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

export const updateUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("invalid User id format"),
  check("name").optional().notEmpty().withMessage("User name is required"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (value, { req }) => {
      const user = await UserModel.find({ email: value });
      if (user.length > 0) {
        return Promise.reject("Email already in use");
      }
    }),
  check("phone")
    .optional()
    //ar-EG for Egypt, ar-SA for Saudi Arabia
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number format"),
  check("profilePicture").optional(),
  validatorMiddleware,
];

export const updateUserPasswordValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("invalid User id format"),
  check("oldPassword").notEmpty().withMessage("old password is required"),
  check("newPassword")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom(async (newPassword, { req }) => {
      const { id } = req.params as { id: string };
      const pepper = process.env.PEPPER as string;
      const user = await UserModel.findById(id);
      if (!user) {
        return Promise.reject("User not found");
      }
      const isCorrect = bcrypt.compareSync(
        `${req.body.oldPassword}${pepper}`,
        user.password
      );
      const isSame = bcrypt.compareSync(
        `${newPassword}${pepper}`,
        user.password
      );
      if (!isCorrect) {
        return Promise.reject(`Old password is incorrect`);
      } else if (isSame) {
        return Promise.reject("New password is the same as old password");
      } else {
        //if old password is correct and new password is not the same as old password
        return true;
      }
    }),
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
export const updateLoggedUserPasswordValidator = [
  check("oldPassword").notEmpty().withMessage("old password is required"),
  check("newPassword")
    .notEmpty()
    .withMessage("new password is required")
    .isLength({ min: 6 })
    .withMessage("password must be at least 6 characters")
    .custom(async (newPassword, { req }) => {
      const { id } = req.params as { id: string };
      const pepper = process.env.PEPPER as string;
      const user = await UserModel.findById(id);
      if (!user) {
        return Promise.reject("User not found");
      }
      const isCorrect = bcrypt.compareSync(
        `${req.body.oldPassword}${pepper}`,
        user.password
      );
      const isSame = bcrypt.compareSync(
        `${newPassword}${pepper}`,
        user.password
      );
      if (!isCorrect) {
        return Promise.reject(`Old password is incorrect`);
      } else if (isSame) {
        return Promise.reject("New password is the same as old password");
      } else {
        //if old password is correct and new password is not the same as old password
        return true;
      }
    }),
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

export const deleteUserValidator = [
  check("id")
    .notEmpty()
    .withMessage("User id is required")
    .isMongoId()
    .withMessage("invalid User id format"),
  validatorMiddleware,
];
export const updateLoggedUserValidator = [
  check("name").optional().notEmpty().withMessage("User name is required"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (value, { req }) => {
      const user = await UserModel.find({ email: value });
      if (user.length > 0) {
        return Promise.reject("Email already in use");
      }
    }),
  check("phone")
    .optional()
    //ar-EG for Egypt, ar-SA for Saudi Arabia
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("invalid phone number format"),
  check("profilePicture").optional(),
  validatorMiddleware,
];

export default {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserValidator,
  deleteUserValidator,
};
