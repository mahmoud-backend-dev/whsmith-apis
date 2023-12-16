import { body,param } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js'
import Order from '../../models/Order.js';
import NotFoundError from '../../errors/notFound.js';

export const updateStatusOrderValidator = [
  param('id')
    .custom(async (val) => {
      const order = await Order.findById(val)
      if (!order)
        throw new NotFoundError(`No order for this id:${val}`);
      return true;
    }),
  body('status').notEmpty().withMessage('status required')
    .custom((val) => {
      const arrOfStatus = ['Processed', 'Delivered', 'UnDelivered', 'Canceled'];
      if (!arrOfStatus.includes(val))
        throw new BadRequest('status must be Processed, Delivered, UnDelivered or Canceled')
      return true
    }),
  validatorMiddleware,
];

export const removeOrderValidator = [
  param('id')
    .custom(async (val) => {
      const order = await Order.findById(val)
      if (!order)
        throw new NotFoundError(`No order for this id:${val}`);
      return true;
    }),
  validatorMiddleware,
];