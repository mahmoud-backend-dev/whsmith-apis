import { body, param } from 'express-validator';
import NotFound from '../../errors/notFound.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js';
import Category from '../../models/Category.js';
import BadRequest from '../../errors/badRequest.js';
import NotFoundError from '../../errors/notFound.js';

export const addCategoryValidator = [
  body('name').isObject().withMessage('name must be object two keys ar and eg'),
  body('name.ar').notEmpty().withMessage('Arabic name required')
      .custom(async (val) => {
        const category = await Category.findOne({ "name.ar": val, isArchive: false });
        if (category)
          throw new BadRequest('Duplicate value entered for arabic name field, please choose another value')
        return true
      }),
  body('name.en').notEmpty().withMessage('English name required')
    .custom(async (val) => {
      const category = await Category.findOne({ "name.en": val, isArchive: false });
      if (category)
        throw new BadRequest('Duplicate value entered for english name field, please choose another value')
      return true
  }),
  validatorMiddleware,
];

export const updateCategoryValidator = [
  param('id')
    .custom(async (val) => {
      const category = await Category.findById(val)
      if (!category)
        throw new NotFoundError(`No category for this id: ${val}`)
      return true
    }),
  body('name').optional().isObject().withMessage('name must be object two keys ar and eg'),
  body('name.ar').optional().notEmpty().withMessage('Arabic name required')
    .custom(async (val, { req }) => {
      const category = await Category.findOne({ _id: { $ne: req.params.id }, "name.ar": val, isArchive: false });
      if (category)
        throw new BadRequest('Duplicate value entered for arabic name field, please choose another value')
      return true
    }),
  body('name.en').optional().notEmpty().withMessage('English name required')
    .custom(async (val, { req }) => {
      const category = await Category.findOne({ _id: { $ne: req.params.id },"name.en": val, isArchive: false });
      if (category)
        throw new BadRequest('Duplicate value entered for english name field, please choose another value')
      return true
    }),
  validatorMiddleware
]

export const removeCategoryValidator = [
  param('id').custom(async (val) => {
    const category = await Category.findById(val);
    if (!category)
      throw new NotFound(`No category for this id ${val}`)
    return true
  }),
  validatorMiddleware,
]