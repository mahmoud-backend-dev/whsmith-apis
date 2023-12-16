import { body,param } from 'express-validator';
import Product from '../../models/Product.js';
import NotFoundError from '../../errors/notFound.js';
import validatorMiddleWare from '../../middleware/validatorMiddleware.js';
import Cart from '../../models/Cart.js';
import Store from '../../models/Store.js';
import BadRequest from '../../errors/badRequest.js';


export const addToCartValidator = [
  body('productId').notEmpty().withMessage('productId required')
    .custom(async (val) => {
      const product = await Product.findOne({ _id: val, isArchive: false });
      if (!product)
        throw new NotFoundError(`No product for this id ${val}`);
      return true
    }),
  body('quantity').notEmpty().isNumeric().withMessage('quantity required and numeric value')
    .custom(async (val,{req}) => {
      const product = await Product.findOne({ _id: req.body.productId, isArchive: false });
      if (product.quantity < val)
        throw new BadRequest('No quantity in stock')
      return true
    }),
  body('store').notEmpty().isMongoId().withMessage('store required and must be type ObjectId')
    .custom(async (val, { req }) => {
      const store = await Store.findOne({ _id: val, isArchive: false });
      if (!store)
        throw new NotFoundError(`No store for this id: ${val}`);
      const product = await Product.findOne({ _id: req.body.productId, isArchive: false });
      const isFound = product.stores.filter((item) => item.store == val);
      if (isFound.length == 0)
        throw new BadRequest('This product not belongs to store')
      return true;
    }),
  validatorMiddleWare
];

export const updateCartValidator = [
  body('quantity').notEmpty().withMessage('quantity required')
    .isNumeric().withMessage('quantity must be numeric value'),
  validatorMiddleWare,
];

export const removeCartValidator = [
  param('itemID')
    .custom(async (val, { req }) => {
      const cart = await Cart.findOne({ user: req.user._id });
      if (!cart)
        throw new NotFoundError(`No Cart for this user id: ${req.user._id}`);

      const indexProduct = cart.cartItems.findIndex((item) => item.product.toString() === val);
      if (indexProduct == -1)
        throw new NotFoundError(`No cart item for this id: ${val}`);

      return true;
    }),
    validatorMiddleWare,
]