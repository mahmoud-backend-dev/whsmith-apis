import { model, Schema } from "mongoose";

const mainSectionSchema = new Schema({
  _id: false,
  h1: {
    ar: String,
    en: String,
  },
  h2: {
    ar: String,
    en: String,
  },

  h3: {
    ar: String,
    en: String,
  },
  image: String,
});

const sectionOneSchema = new Schema({
  _id: false,
  label: {
    ar: String,
    en:String,
  },
  description: {
    ar: String,
    en: String,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
});

const sectionTwoSchema = new Schema({
  _id: false,
  label: {
    ar: String,
    en: String,
  },
  description: {
    ar: String,
    en: String,
  },
  images: [String],
});

const sectionThreeSchema = new Schema({
  _id: false,
  label: {
    ar: String,
    en: String,
  },
  description: {
    ar: String,
    en: String,
  },
  products: [{
    type: Schema.Types.ObjectId,
    ref: 'Product'
  }],
});

const sectionFourSchema = new Schema({
  _id: false,
  label: {
    ar: String,
    en: String,
  },
  categories: [{
    type: Schema.Types.ObjectId,
    ref: 'Category',
  }],
});

const sectionFiveSchema = new Schema({
  _id: false,
  label: {
    ar: String,
    en: String,
  },
  images: [String],
});

const sectionSchema = new Schema({
  mainSection: mainSectionSchema,
  sectionOne: sectionOneSchema,
  sectionTwo: sectionTwoSchema,
  sectionThree: sectionThreeSchema,
  sectionFour: sectionFourSchema,
  sectionFive: sectionFiveSchema,
}, { versionKey: false });

export default model('Section', sectionSchema);



