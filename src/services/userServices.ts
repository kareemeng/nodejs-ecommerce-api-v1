import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/UserModel";
import handler from "./handlers";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware";

export const uploadUserImage = uploadSingleImage("profilePicture");
export const resizeUserImage = handler.resizeImage(500, 500, "jpeg", "users");

/**  Get List of All Users
 * @route GET /api/v1/users
 * @access private/admin
 */
export const getUsers = handler.getAll(UserModel, "users");

/** Get specific User
 * @route GET /api/v1/users/:id
 * @access private/admin
 */
export const getUser = handler.getOne(UserModel);

/** Get logged User Data
 * @route GET /api/v1/users/myProfile
 * @access private/admin
 */
export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return next(new Error("User not found"));
  }
  req.params.id = req.user._id!;
  next();
};

/**
 * change profile password
 * @route PUT /api/v1/users/changeProfilePassword
 * @access private
 */
export const changeProfilePassword =
  handler.updateLoggedUserPassword(UserModel);

/**
 * change profile data except password and role
 * @route PUT /api/v1/users/changeProfilePassword
 * @access private
 */
export const changeProfileData = handler.updateLoggedUserData(UserModel);

/** Create New User
 * @route POST /api/v1/users
 * @access private/admin
 */
export const createUser = handler.createOne(UserModel);

/** Update Specific Users
 * @route PUT /api/v1/users/:id
 * @access private/admin
 */
export const updateUser = handler.updateUser(UserModel);

/** Update Specific User Password
 * @route PUT /api/v1/users/:id
 * @access private
 */
export const updateUserPassword = handler.updateUserPassword(UserModel);

/** Delete Specific Users
 * @route DELETE /api/v1/users/:id
 * @access private/admin
 */
export const deleteUser = handler.deleteOne(UserModel);

/** Deactivate Specific Users
 * @route DELETE /api/v1/users/:id
 * @access public
 */
export const deactivateUser = handler.deactivateUser(UserModel);

export default {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
