import express from "express";
import {
  getUsers,
  createUser,
  getUser,
  getMyProfile,
  updateUser,
  deleteUser,
  uploadUserImage,
  resizeUserImage,
  updateUserPassword,
  changeProfilePassword,
  deactivateUser,
  changeProfileData,
} from "../services/userServices";
import {
  getUserValidator,
  createUserValidator,
  updateUserValidator,
  updateUserPasswordValidator,
  updateLoggedUserPasswordValidator,
  updateLoggedUserValidator,
  deleteUserValidator,
} from "../utils/validators/userValidator";
import { protect, restrictTo } from "../services/authServices";
const router = express.Router();
router.use(protect);

router.get("/myProfile", getMyProfile, getUser);
router.put(
  "/changeProfilePassword",
  updateLoggedUserPasswordValidator,
  changeProfilePassword
);
router.put(
  "/changeProfileData",
  uploadUserImage,
  resizeUserImage,
  updateLoggedUserValidator,
  changeProfileData
);
router.delete("/deactivateProfile", getMyProfile, deactivateUser);
// protect all routes after this middleware (all routes below this middleware)
router.use(restrictTo("admin"));
router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, resizeUserImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUser)
  .put(uploadUserImage, resizeUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put(
  "/changePassword/:id",
  updateUserPasswordValidator,
  updateUserPassword
);
router.delete("/deactivateUser/:id", deactivateUser);
export default router;
