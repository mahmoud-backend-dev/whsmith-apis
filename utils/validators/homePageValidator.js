import { body, param } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import NotFoundError from '../../errors/notFound.js';
import Product from '../../models/Product.js';
import Category from '../../models/Category.js';
import validatorMiddleWare from '../../middleware/validatorMiddleware.js';

export const addOneSectionValidator = [
  body('label').isObject().withMessage('label must be object with two key ar and en'),
  body('label.ar').isString().withMessage('Arabic label required'),
  body('label.en').isString().withMessage('English label required'),
  body("description")
    .isObject()
    .withMessage("description must be object with two key ar and en"),
  body("description.ar")
    .isString()
    .withMessage("Arabic description required")
    .isLength({ min: 20 })
    .withMessage("Too short product arabic description"),
  body("description.en")
    .isString()
    .withMessage("English description required")
    .isLength({ min: 20 })
    .withMessage("Too short product english description"),
  body('products').isArray().withMessage('products must be an array of string ObjectId')
    .custom(async (val) => {
      if (!val) {
        throw new BadRequest('Enter products array of ObjectId')
      }
      await Promise.all(val.map(async (productID) => {
        const product = await Product.findById(productID);
        if (!product)
          throw new NotFoundError(`No product for this id: ${productID}`);
      }));
      return true;
  }),
  validatorMiddleWare,
];

export const addTwoSectionValidator = [
  body('label').isObject().withMessage('label must be object with two key ar and en'),
  body('label.ar').isString().withMessage('Arabic label required'),
  body('label.en').isString().withMessage('English label required'),
  body('description').isObject().withMessage('description must be object with two key ar and en'),
  body('description.ar').isString().withMessage('Arabic description required')
    .isLength({ min: 20 }).withMessage('Too short product arabic description'),
  body('description.en').isString().withMessage('English description required')
    .isLength({ min: 20 }).withMessage('Too short product english description'),
  body('images')
    .custom((val, { req }) => {
      if (!req.files) {
        throw new BadRequest('Please enter images');
      }
      return true
    }),
  validatorMiddleWare,
];

export const updateSectionTwoValidator = [
  body('label').isObject().withMessage('label must be object with two key ar and en'),
  body('label.ar').isString().withMessage('Arabic label required'),
  body('label.en').isString().withMessage('English label required'),
  body('description').isObject().withMessage('description must be object with two key ar and en'),
  body('description.ar').isString().withMessage('Arabic description required')
    .isLength({ min: 20 }).withMessage('Too short product arabic description'),
  body('description.en').isString().withMessage('English description required')
    .isLength({ min: 20 }).withMessage('Too short product english description'),
  validatorMiddleWare,
]

export const updateSectionTwoImageValidator = [
  body('image')
    .custom((val, { req }) => {
      if (!req.file) {
        throw new BadRequest('Please enter image');
      }
      return true
    }),
  validatorMiddleWare,
];

export const addSectionThreeValidator = [
  body('label').isObject().withMessage('label must be object with two key ar and en'),
  body('label.ar').isString().withMessage('Arabic label required'),
  body('label.en').isString().withMessage('English label required'),
  body('description').isObject().withMessage('description must be object with two key ar and en'),
  body('description.ar').isString().withMessage('Arabic label required')
    .isLength({ min: 20 }).withMessage('Too short product arabic description'),
  body('description.en').isString().withMessage('English label required')
    .isLength({ min: 20 }).withMessage('Too short product english description'),
  body('products').isArray().withMessage('products must be an array of string ObjectId')
    .custom(async (val) => {
      await Promise.all(val.map(async (productID) => {
        const product = await Product.findById(productID);
        if (!product)
          throw new NotFoundError(`No product for this id: ${productID}`);
      }));
      return true;
    }),
  validatorMiddleWare,
];

export const addSectionFourValidator = [
  body('label').isObject().withMessage('label must be object with two key ar and en'),
  body('label.ar').isString().withMessage('Arabic label required'),
  body('label.en').isString().withMessage('English label required'),
  body('categories').isArray().withMessage('categories must be an array of string ObjectId')
    .custom(async (val) => {
      if (!val) {
        throw new BadRequest('Enter categories array of ObjectId')
      }
      await Promise.all(val.map(async (categoryID) => {
        const category = await Category.findById(categoryID);
        if (!category)
          throw new NotFoundError(`No category for this id: ${categoryID}`);
      }));
      return true;
    }),
  validatorMiddleWare,
];

export const addSectionFiveValidator = [
  body('label').isObject().withMessage('label must be object with two key ar and en'),
  body('label.ar').isString().withMessage('Arabic label required'),
  body('label.en').isString().withMessage('English label required'),
  body('images')
    .custom((val, { req }) => {
      if (!req.files) {
        throw new BadRequest('Please enter images');
      }
      return true
    }),
  validatorMiddleWare,
];

export const updateSectionFiveValidator = [
  body('label').isObject().withMessage('label must be object with two key ar and en'),
  body('label.ar').isString().withMessage('Arabic label required'),
  body('label.en').isString().withMessage('English label required'),
  validatorMiddleWare,
];

export const addImageSectionFiveValidator = [
  body('image')
    .custom((val, { req }) => {
      if (!req.file) {
        throw new BadRequest('Please enter image');
      }
      return true
    }),
  validatorMiddleWare,
];

export const removeImageSectionFiveValidator = [
  body('nameImg').notEmpty().withMessage('nameImg is required'),
  validatorMiddleWare,
];

export const addMainSectionValidator = [
  body('h1').isObject().withMessage('h1 must be object with two key ar and en'),
  body('h1.ar').isString().withMessage('Arabic h1 required'),
  body('h1.en').isString().withMessage('English h1 required'),
  body('h2').isObject().withMessage('h2 must be object with two key ar and en'),
  body('h2.ar').isString().withMessage('Arabic h2 required'),
  body('h2.en').isString().withMessage('English h2 required'),
  body('h3').isObject().withMessage('h3 must be object with two key ar and en'),
  body('h3.ar').isString().withMessage('Arabic h3 required'),
  body('h3.en').isString().withMessage('English h3 required'),
  body('image').custom((val, { req }) => { 
    if (!req.file) {
      throw new BadRequest('Please enter image');
    }
    return true
  }),
  validatorMiddleWare,
]
