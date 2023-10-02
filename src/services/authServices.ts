// import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { UserModel, User } from "../models/UserModel";
import apiError from "../utils/apiError";
import sendEmail from "../utils/sendEmail";
import { generateToken, verifyToken } from "../utils/generate-verifyToken";
//* to add user to req object (req.user) in typescript
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

const changedPasswordAfter = (time: number, passwordChangedAt: Date) => {
  if (passwordChangedAt) {
    const changedTimestamp = parseInt(
      `${passwordChangedAt.getTime() / 1000}`, // divide by 1000 to remove milliseconds
      10 // base 10 to remove decimal point (parseInt default is base 10)
    ); // convert to seconds to compare with time
    return time < changedTimestamp;
  }
  return false;
};
const hash = (token: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  return hashedToken;
};
const createPasswordResetToken = () => {
  //generate six digit random number
  const resetToken = `${Math.floor(100000 + Math.random() * 900000)}`;
  // encrypt resetToken using crypto
  const hashedToken = hash(resetToken);
  // set resetTokenExpiresAt
  const resetTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes
  return { resetToken, hashedToken, resetTokenExpiresAt };
};
/**
 * @desc    Signup
 * @route   POST /api/auth/signup
 * @access  public
 */
export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body;
    const user = await UserModel.create({ name, email, password });
    const token = generateToken({ userId: user._id });
    res.status(201).json({ data: user, token });
  }
);
/**
 * @desc    Login
 * @route   POST /api/auth/login
 * @access  public
 */
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    // validate email
    if (!user) {
      // ! don't send specific error messages to the client for security reasons
      return next(new apiError("Invalid email or password", 401)); //? 401: Unauthorized
    }
    //? ! for non-null assertion operator (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator)
    const isMatch = await bcrypt.compare(
      password + process.env.PEPPER!,
      user.password
    );
    // validate password
    if (!isMatch) {
      // ! don't send specific error messages to the client for security reasons
      return next(new apiError("Invalid email or password", 401)); //? 401: Unauthorized
    }
    const token = generateToken({ userId: user._id });
    res.status(201).json({ data: user, token });
  }
);
/**
 * @desc    Protect route
 * @note    this middleware is used to protect routes
 */
export const protect = asyncHandler(async (req, res, next) => {
  // check if token exists in the request header and starts with Bearer (Bearer token)
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new apiError("You are not logged in", 401));
  }
  const token = req.headers.authorization.split(" ")[1];
  const payload = verifyToken(token) as any;
  // check if token is valid (not expired) and (not manipulated)
  if (!payload) {
    return next(new apiError("You are not logged in", 401));
  }
  //   check if user still exists (deleted user)
  const user = await UserModel.findById(payload.userId);
  if (!user) {
    return next(
      new apiError("The user belonging to this token does not exist", 401)
    );
  }
  // check if user changed password after the token was issued (iat: issued at)
  if (changedPasswordAfter(payload.iat, user.passwordChangedAt!)) {
    return next(
      new apiError("User recently changed password! Please log in again", 401)
    );
  }
  // check if user is active
  if (!user.active) {
    return next(
      new apiError(
        "This account has been deactivated. Please contact support",
        401
      )
    );
  }
  // grant access to protected route
  req.user = user;
  next();
});
/**
 * @desc    Restrict to certain roles
 * @param   roles - array of roles
 * @note    this middleware is used to restrict access to certain roles
 */
export const restrictTo = (...roles: string[]) =>
  asyncHandler(async (req, res, next) => {
    const { role } = req.user;
    if (!role || !roles.includes(role)) {
      return next(
        new apiError("You do not have permission to perform this action", 403)
      );
    }
    next();
  });
/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgotPassword
 * @access  public
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(
        new apiError("There is no user with this email address", 404)
      );
    }
    const resetToken = createPasswordResetToken();
    const message = `Hi ${user.name},\n\nYou are receiving this email because you (or someone else) has requested the reset of a password.\n\nPlease use the following token to reset your password: ${resetToken.resetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`;
    // try catch block to handle errors in sending email and saving user
    try {
      user.passwordResetToken = resetToken.hashedToken;
      user.passwordResetExpiresAt = resetToken.resetTokenExpiresAt;
      user.passwordResetVerified = false;
      await user.save({ validateBeforeSave: false });
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpiresAt = undefined;
      user.passwordResetVerified = undefined;
      await user.save({ validateBeforeSave: false });
      return next(
        new apiError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }

    res
      .status(200)
      .json({ status: "success", message: "Token sent to email!" });
  }
);
/**
 * @desc    Verify password reset token
 * @route   POST /api/auth/verifyResetToken
 * @access  public
 */
export const verifyPasswordResetToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // find user by email and check if token is not expired (passwordResetExpiresAt > Date.now())
    const hashedToken = hash(req.body.resetToken);
    const user = await UserModel.findOne({
      email: req.body.email,
    });
    if (!user) {
      return next(new apiError("user not found for this email", 400));
    }
    // set passwordResetVerified to true
    const token = user.passwordResetToken;
    const expiresAt = user.passwordResetExpiresAt
      ? (user.passwordResetExpiresAt as Date)
      : new Date();

    if (token !== hashedToken || expiresAt.getTime() < Date.now()) {
      return next(new apiError("Token is invalid or has expired", 400));
    }
    user.passwordResetVerified = true;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ status: "success", message: "Token verified!" });
  }
);
/**
 * @desc    Reset password
 * @route   POST /api/auth/resetPassword
 * @access  public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      return next(new apiError("User not found", 404));
    }
    if (!user.passwordResetVerified) {
      return next(new apiError("reset Token not verified", 400));
    }
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordResetVerified = undefined;
    user.password = req.body.newPassword;
    user.save({ validateBeforeSave: false });
    const token = generateToken({ userId: user._id });
    res
      .status(200)
      .json({ status: "success", message: "Password reset!", token });
  }
);
