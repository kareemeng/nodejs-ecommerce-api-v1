import express from "express";
// TODO: add validation (e.x phone number , postal code , ...)
import {
  addToAddresses,
  RemoveFromAddresses,
  getAddresses,
} from "../services/addressServices";
// import {
//   getAddressesValidator,
//   createAddressesValidator,
//   updateAddressesValidator,
//   deleteAddressesValidator,
// } from "../utils/validators/AddressesValidator";
import { protect, restrictTo } from "../services/authServices";
const router = express.Router();

router.use(protect, restrictTo("user"));

router.route("/").get(getAddresses).post(addToAddresses);

router.route("/:addressId").delete(RemoveFromAddresses);
//   .get(getAddressesValidator, getAddresses)

export default router;
