import { Schema, model } from "mongoose";

const storeSchema = new Schema(
  {
    name: {
      ar: {
        type: String,
        required: [true, "arabic name required"],
        minlength: [2, "Too short arabic name "],
      },
      en: {
        type: String,
        required: [true, "english name required"],
        minlength: [2, "Too short english name"],
      },
    },
    region: {
      ar: {
        type: String,
        required: [true, "arabic region required"],
      },
      en: {
        type: String,
        required: [true, "english region required"],
      },
    },
    city: {
      ar: {
        type: String,
        required: [true, "arabic city required"],
      },
      en: {
        type: String,
        required: [true, "english city required"],
      },
    },
    image: {
      type:String
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

storeSchema.pre(/^find/, function (next) {
  this.select("-__v -createdAt -updatedAt -isArchive");
  next();
});

export default model('Store', storeSchema);