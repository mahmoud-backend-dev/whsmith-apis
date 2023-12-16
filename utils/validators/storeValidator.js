import { body, param } from 'express-validator';
import NotFound from '../../errors/notFound.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js';
import Store from '../../models/Store.js';
import BadRequest from '../../errors/badRequest.js';

export const addStoreValidator = [

  body('name').isObject().withMessage('name must be object two keys ar and eg'),
  body('name.ar').notEmpty().withMessage('Arabic name required')
    .custom(async (val) => {
      const store = await Store.findOne({ "name.ar": val, isArchive: false });
      if (store)
        throw new BadRequest('Duplicate value entered for arabic name field, please choose another value')
      return true
    }),
  body('name.en').notEmpty().withMessage('English name required')
    .custom(async (val) => {
      const store = await Store.findOne({ "name.en": val, isArchive: false });
      if (store)
        throw new BadRequest('Duplicate value entered for english name field, please choose another value')
      return true
    }),
  body('region').isObject().withMessage('country must be object with two key ar and en'),
  body('region.ar').notEmpty().withMessage('Arabic country required'),
  body('region.en').notEmpty().withMessage('English country required'),
  body('city').isObject().withMessage('town must be object with two key ar and en'),
  body('city.ar').notEmpty().withMessage('Arabic town required'),
  body('city.en').notEmpty().withMessage('English town required'),
  body('image').custom((val, { req }) => { 
    if (!req.file) {
      throw new BadRequest('Please enter image');
    }
    return true
  }),
  validatorMiddleware,
];

export const updatedStoreValidator = [
  param('id').custom(async (val) => {
    const store = await Store.findById(val);
    if (!store)
      throw new NotFound(`No store for this id ${val}`)
    return true
  }),
  body('name').optional().isObject().withMessage('name must be object two keys ar and eg'),
  body('name.ar').optional().notEmpty().withMessage('Arabic name required')
    .custom(async (val, { req }) => {
      const store = await Store.findOne({  _id: { $ne: req.params.id },"name.ar": val, isArchive: false });
      if (store)
        throw new BadRequest('Duplicate value entered for arabic name field, please choose another value')
      return true
    }),
  body('name.en').optional().notEmpty().withMessage('English name required')
    .custom(async (val, { req }) => {
      const store = await Store.findOne({ _id: { $ne: req.params.id },"name.en": val, isArchive: false });
      if (store)
        throw new BadRequest('Duplicate value entered for english name field, please choose another value')
      return true
    }),
  body('region').optional().isObject().withMessage('region must be object with two key ar and en'),
  body('region.ar').optional().notEmpty().withMessage('Arabic region required'),
  body('region.en').optional().notEmpty().withMessage('English region required'),
  body('city').optional().isObject().withMessage('city must be object with two key ar and en'),
  body('city.ar').optional().notEmpty().withMessage('Arabic city required'),
  body('city.en').optional().notEmpty().withMessage('English city required'),
  validatorMiddleware,
];

export const removeStoreValidator = [
  param('id').custom(async (val) => {
    const store = await Store.findById(val);
    if (!store)
      throw new NotFound(`No store for this id ${val}`)
    return true
  }),
  validatorMiddleware,
];