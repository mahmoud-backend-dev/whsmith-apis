import { body, param } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import NotFoundError from '../../errors/notFound.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js'
import User from '../../models/User.js';
import Role from '../../models/Role.js';


export const changePasswordValidator = [
  body('currentPassword').notEmpty().withMessage('currentPassword required'),
  body('newPassword').notEmpty().withMessage('newPassword required')
    .isLength({ min: 6 }).withMessage('Too short password'),
  body('confirmPassword').notEmpty().withMessage('confirmPassword required')
    .custom((val, { req }) => {
      if (val !== req.body.newPassword)
        throw new BadRequest('Password confirmation incorrect')
      return true
    }),
  validatorMiddleware,
];


export const addAddressValidator = [
  body('address').notEmpty().withMessage('address required'),
  validatorMiddleware,
];

export const removeAddressValidator = [
  param('id')
    .custom(async (val, { req }) => {
      const user = await User.findById(req.user._id);

      const indexAddress = user.addresses.findIndex((add) => add._id.toString() === val);
      if (indexAddress - 1)
        throw new NotFoundError(`No cart item for this id: ${val}`);

      return true;
    }),
  validatorMiddleware,
];

export const deleteUserValidator = [
  param('id')
    .custom(async (val) => {
      const user = await User.findById(val);
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`)
      if (user.role === 'admin')
        throw new BadRequest('You are not allow delete this user')
      return true
    }),
    validatorMiddleware,
];

export const addBanTimeValidator = [
  param('id')
    .custom(async (val, { req }) => {
      const user = await User.findById(val);
      if (val === req.user._id.toString())
        throw new BadRequest('You are not allow ban yourself')
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`)
      return true
    }),
  body('data').notEmpty().withMessage('data required'),
  validatorMiddleware,
];

export const banUserValidator = [
  param('id')
    .custom(async (val, { req }) => {
      const user = await User.findById(val);
      if (val === req.user._id.toString())
        throw new BadRequest('You are not allow ban yourself')
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`)
      return true
    }),
  validatorMiddleware
];

export const addRoleUserValidator = [
  body('role').isMongoId().withMessage('role required and must be mongoId')
    .custom(async (val) => {
      const role = await Role.findById(val);
      if (!role)
        throw new NotFoundError(`No role for this id: ${val}`);
      return true;
    }),
  body('user').isMongoId().withMessage('user required and must be mongoId')
    .custom(async (val) => {
      const user = await User.findById(val);
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`);
      return true;
    }),
  validatorMiddleware,
];

export const removeRoleUserValidator = [
  body('user').isMongoId().withMessage('user required and must be mongoId')
    .custom(async (val) => {
      const user = await User.findById(val);
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`);
      if (user.role === null)
        throw new BadRequest('This user has no role');
      return true;
    }),
  validatorMiddleware
];