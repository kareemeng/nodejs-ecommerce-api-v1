import mongoose from "mongoose";

// interface for the model
export interface Brand {
  name: string;
  slug?: string;
  image?: string;
}

//1- create schema with the Brand interface
const brandSchema = new mongoose.Schema<Brand>(
  {
    name: {
      type: String,
      required: [true, "Brand required"],
      unique: true,
      minlength: [2, "Too short Brand name"],
      maxlength: [32, "Too long Brand name"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: { type: String },
  },
  { timestamps: true }
);
//mongoose query middleware
const setImageUrl = function (doc: Brand) {
  if (doc.image) {
    const imageURL = `${process.env.API_URL}/brands/${doc.image}`;
    doc.image = imageURL; // replace image name with full url
  }
};
brandSchema.post<Brand>("init", (doc) => {
  setImageUrl(doc);
});
brandSchema.post<Brand>("save", (doc) => {
  setImageUrl(doc);
});
// 2- create Model
// while naming model its convention to start with capital letters
export const BrandModel = mongoose.model("Brand", brandSchema);
