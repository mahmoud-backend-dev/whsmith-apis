import { body } from 'express-validator';
import BadRequest from '../../errors/badRequest.js';
import validatorMiddleware from '../../middleware/validatorMiddleware.js'

export const signupValidator = [
  body('email').notEmpty().withMessage('email required')
    .isEmail().withMessage('E-mail must be valid format'),
  body('password').notEmpty().withMessage('password required')
    .isLength({ min: 6 }).withMessage('Too short password'),
  body('confirmPassword').notEmpty().withMessage('confirmPassword required')
    .custom((val, { req }) => {
      if (val !== req.body.password)
        throw new BadRequest('Password confirmation incorrect')
      return true
    }),
  body('firstName').notEmpty().withMessage('firstName required'),
  body('lastName').notEmpty().withMessage('lastName required'),
  validatorMiddleware,
];

export const verifyForSignupValidator = [
  body('token').notEmpty().withMessage('token required'),
  validatorMiddleware,
];

export const forgetPasswordValidator = [
  body('email').notEmpty().withMessage('email required'),
  validatorMiddleware,
];

export const resetPasswordValidator = [
  body('email').notEmpty().withMessage('email required'),
  body('newPassword').notEmpty().withMessage('newPassword required'),
  validatorMiddleware,
];

export const loginValidator = [
  body('email').notEmpty().withMessage('email required')
    .isEmail().withMessage('E-mail must be valid format'),
  body('password').notEmpty().withMessage('password required')
    .isLength({ min: 6 }).withMessage('Too short password'),
  validatorMiddleware,
];

export const resendEmailValidator = [
  body('email').isEmail().withMessage('E-mail must be valid format'),
  validatorMiddleware,
];

export const changeEmailValidator = [
  body('email').isEmail().withMessage('E-mail must be valid format'),
  body('newEmail').isEmail().withMessage('E-mail must be valid format'),
  validatorMiddleware,
];



