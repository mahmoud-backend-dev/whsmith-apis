import { body, param } from 'express-validator';
import NotFound from '../../errors/notFound.js';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js';
import Category from '../../models/Category.js';
import Store from '../../models/Store.js';
import Product from '../../models/Product.js';

export const addProductValidator = [
  body('name').isObject().withMessage('name must be object two keys ar and eg'),
  body('name.ar').notEmpty().withMessage('Arabic name required')
    .isLength({ min: 3 }).withMessage('Too short arabic product name ')
    .isLength({ max: 100 }).withMessage('Too long arabic product name '),
  body('name.en').notEmpty().withMessage('English name required')
    .isLength({ min: 3 }).withMessage('Too short english product name ')
    .isLength({ max: 100 }).withMessage('Too long english product name '),
  body('description').isObject().withMessage('description must be object with two key ar and en'),
  body('description.ar').notEmpty().withMessage('Arabic description required')
    .isLength({ min: 20 }).withMessage('Too short product arabic description'),
  body('description.en').notEmpty().withMessage('English description required')
    .isLength({ min: 20 }).withMessage('Too short product english description'),
  body('stores').isArray().withMessage('stores must be array of object contain store and price'),
  body('stores.*.store').notEmpty().withMessage('store required')
    .custom(async (val) => {
      const store = await Store.findById(val);
      if (!store)
        throw new NotFound(`No store for this id ${val}`)
      return true
    }),
  body('stores.*.price').isNumeric().withMessage('price must be a number'),
  body('stores.*.quantity').notEmpty().withMessage('Product quantity is required')
    .isNumeric().withMessage('Product quantity must be a number'),
  body('images')
    .custom(async (val, { req }) => {
      if (req.files.length == 0)
        throw new BadRequest('Please provide array of image for product and enctype equal multipart/form-data')
    }),
  body('category').notEmpty().withMessage('category must be belongs to category')
    .custom(async (val) => {
      const category = await Category.findById(val);
      if (!category)
        throw new NotFound(`No category for this id ${val}`)
      return true
    }),
  validatorMiddleware,
];

export const updateProductValidator = [
  param('id')
    .custom(async (val) => {
      const product = await Product.findOne({ _id: val, isArchive: false });
      if (!product)
        throw new NotFound(`No product for this id ${val}`)
      return true;
    }),
  body('name').optional().isObject().withMessage('name must be object two keys ar and eg'),
  body('name.ar').optional().notEmpty().withMessage('Arabic name required')
    .isLength({ min: 3 }).withMessage('Too short arabic product name ')
    .isLength({ max: 100 }).withMessage('Too long arabic product name '),
  body('name.en').optional().notEmpty().withMessage('English name required')
    .isLength({ min: 3 }).withMessage('Too short english product name ')
    .isLength({ max: 100 }).withMessage('Too long english product name '),
  body('description').optional().isObject().withMessage('description must be object with two key ar and en'),
  body('description.ar').optional().notEmpty().withMessage('Arabic description required')
    .isLength({ min: 20 }).withMessage('Too short product arabic description'),
  body('description.en').optional().notEmpty().withMessage('English description required')
    .isLength({ min: 20 }).withMessage('Too short product english description'),
  body('stores.*.store').optional()
    .custom(async (val) => {
      const store = await Store.findById(val);
      if (!store)
        throw new NotFound(`No store for this id ${val}`)
      return true
    }),
  body('stores.*.price').optional().isNumeric().withMessage('price must be a number'),
  body('stores.*.quantity').optional().notEmpty().withMessage('Product quantity is required')
    .isNumeric().withMessage('Product quantity must be a number'),
  body('category').optional()
    .custom(async (val) => {
      const category = await Category.findById(val);
      if (!category)
        throw new NotFound(`No category for this id ${val}`)
      return true
    }),
  validatorMiddleware,
];

export const getSpecificProductValidator = [
  param('id')
    .custom(async (val) => {
      const product = await Product.findOne({ _id: val, isArchive: false });
      if (!product)
        throw new NotFound(`No product for this id ${val}`)
      return true;
    }),
  validatorMiddleware,
];