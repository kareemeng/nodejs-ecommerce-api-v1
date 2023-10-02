import mongoose from "mongoose";
import bcrypt from "bcrypt";
export interface User {
  _id?: string; // this is the id of the user in the database (mongodb) not the id of the user in the request
  name: string;
  slug?: string;
  email: string;
  password: string;
  passwordChangedAt?: Date;
  passwordResetExpiresAt?: Date | number;
  passwordResetToken?: string;
  passwordResetVerified?: boolean;
  phone?: string;
  profilePicture?: string;
  role?: string;
  active?: boolean;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: [true, `name required`],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, `email required`],
      trim: true,
      unique: true,
    },
    phone: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
    password: {
      type: String,
      required: [true, `password required`],
      minlength: [6, `password must be at least 6 characters`],
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpiresAt: {
      type: Date,
    },
    passwordResetVerified: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: [`user`, `admin`, `manager`],
      default: `user`,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

//mongoose middleware
const setImageUrl = function (doc: User) {
  if (doc.profilePicture) {
    const imageURL = `${process.env.API_URL}/users/${doc.profilePicture}`;
    doc.profilePicture = imageURL; // replace profilePicture name with full url
  }
};
userSchema.post<User>("init", (doc) => {
  setImageUrl(doc);
});
userSchema.post<User>("save", (doc) => {
  setImageUrl(doc);
});
userSchema.pre("save", function (next) {
  if (!this.isModified("password")) {
    //if password not modified return next() to avoid hashing it again
    return next();
  }
  const salt = +(process.env.SALT || 12);
  this.password = bcrypt.hashSync(
    `${this.password}${process.env.PEPPER}`,
    salt
  );
  next();
});
export const UserModel = mongoose.model("User", userSchema);
