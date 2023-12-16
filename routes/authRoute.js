import { Router } from "express";
const router = Router();

import {
  changeEmailValidator,
  forgetPasswordValidator,
  loginValidator,
  resendEmailValidator,
  resetPasswordValidator,
  signupValidator,
  verifyForSignupValidator
} from "../utils/validators/authValidator.js";

import {
  changeEmail,
  forgetPassword,
  login,
  resendVerificationEmail,
  resetPassword,
  signup,
  verifyForPassword,
  verifyForSignup
} from "../controller/authController.js";




router.post('/signup', signupValidator, signup);
router.post('/verifySignup', verifyForSignupValidator, verifyForSignup);
router.post('/forgetPassword', forgetPasswordValidator, forgetPassword);
router.post('/verifyPassword', verifyForSignupValidator, verifyForPassword);
router.patch('/resetPassword', resetPasswordValidator, resetPassword);
router.post('/login', loginValidator, login);
router.post('/resendVerificationEmail', resendEmailValidator, resendVerificationEmail);
router.post('/changeEmail', changeEmailValidator, changeEmail);

export default router;