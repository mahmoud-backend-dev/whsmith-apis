import { body, param } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js'
import Role from '../../models/Role.js';
import NotFoundError from '../../errors/notFound.js';
import User from '../../models/User.js';
import Store from '../../models/Store.js';

export const addRoleValidator = [
  body('name').notEmpty().withMessage('role required'),
  body('permissions').notEmpty().withMessage('permissions required')
    .custom(async(val,{req}) => {
      const arrOfRoles = [
        'manage home setting',
        'manage category',
        'manage store',
        'manage roles',
        'manage user',
        'manage order',
        'manage product',
      ];
      if (val.filter((ele) => arrOfRoles.includes(ele)).length !== val.length)
        throw new BadRequest('permissions must be manage category, manage store, manage roles, manage user, manage order or manage product');
      if (val.includes('manage order'))
        if (!req.body.store)
          throw new BadRequest('store required for manage order permission');
        else {
          const store = await Store.findById(req.body.store);
          if(!store)
            throw new NotFoundError('No store for this id');
        }
      return true;
    }),
  validatorMiddleware
];

export const updateRoleValidator = [
  param('id')
    .custom(async (val,{req}) => {
      const role = await Role.findById(val);
      if (!role)
        throw new NotFoundError(`No role for this id: ${val}`)
      if (req.body.store) {
        if (!role.store) {
          throw new BadRequest('You are not allow to add store to this role')
        }
        const store = await Store.findById(req.body.store);
        if(!store)
          throw new NotFoundError('No store for this id');
      }
      return true;
    }),
  validatorMiddleware,
];

export const removeRoleValidator = [
  param('id')
    .custom(async (val) => {
      const role = await Role.findById(val);
      if (!role)
        throw new NotFoundError(`No role for this id: ${val}`)
      if (role.permissions.includes('admin'))
        throw new BadRequest('You are not allow to remove this role')
      return true
    }),
  validatorMiddleware,
];

export const addAdminRoleValidator = [
  param('id')
    .custom(async (val) => {
      const user = await User.findById(val);
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`)
      return true;
    }),
  // body('name').notEmpty().withMessage('role required'),
  validatorMiddleware,
];

export const removeAdminRoleValidator = [
  param('id')
    .custom(async (val) => {
      const user = await User.findById(val).populate({
        path: 'role',
        select: 'permissions _id'
      });
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`)
      if (!user.role.permissions.includes('admin'))
        throw new BadRequest('This user not admin')
      await Role.findByIdAndRemove(user.role._id);
      return true;
    }),
  validatorMiddleware,
];

export const addOwnerRoleValidator = [
  param('id')
    .custom(async (val) => {
      const user = await User.findById(val);
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`)
      return true;
    }),
  validatorMiddleware,
];

export const removeOwnerRoleValidator = [
  param('id')
    .custom(async (val) => {
      const user = await User.findById(val).populate({
        path: 'role',
        select: 'permissions _id'
      });
      if (!user)
        throw new NotFoundError(`No user for this id: ${val}`)
      if (!user.role.permissions.includes('owner'))
        throw new BadRequest('This user not owner')
      await Role.findByIdAndRemove(user.role._id);
      return true;
    }),
  validatorMiddleware,
];