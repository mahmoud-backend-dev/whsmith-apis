import { model, Schema } from "mongoose";

const categorySchema = new Schema({
  name: {
    ar: {
      type: String,
      required: [true, 'Arabic name of category required'],
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name']
    },
    en: {
      type: String,
      required: [true, 'English name of category required'],
      minlength: [3, 'Too short category name'],
      maxlength: [32, 'Too long category name']
    }
  },
  isArchive: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


categorySchema.set('strictPopulate', false);

categorySchema.pre(/^find/, function (next) {
  this.select("-__v -createdAt -updatedAt -isArchive");
  next()
});

export default model('Category', categorySchema); 