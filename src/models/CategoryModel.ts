import mongoose from "mongoose";
// import dotenv from "dotenv";
// dotenv.config();
// interface for the model
export interface Category {
  name: string;
  slug?: string;
  image?: string;
}

//1- create schema with the category interface
const categorySchema = new mongoose.Schema<Category>(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: true,
      minlength: [3, "Too short category name"],
      maxlength: [32, "Too long category name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String },
  },
  { timestamps: true }
);
const setImageUrl = function (doc: Category) {
  if (doc.image) {
    const imageURL = `${process.env.API_URL}/categories/${doc.image}`;
    doc.image = imageURL; // replace image name with full url
  }
};
// mongoose query middleware
categorySchema.post<Category>("init", (doc) => {
  setImageUrl(doc);
});
categorySchema.post<Category>("save", (doc) => {
  setImageUrl(doc);
});

// 2- create Model
// while naming model its convention to start with capital letters
export const CategoryModel = mongoose.model("Category", categorySchema);
