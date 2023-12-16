import { Router } from "express";
const router = Router();

import productRoute from '../middleware/authMiddleware.js';
import { allowTo } from "../controller/authController.js";

import {
  addCategoryValidator,
  removeCategoryValidator,
  updateCategoryValidator,
} from "../utils/validators/categoryValidator.js";

import {
  addCategory,
  getAllCategory,
  getSpecificCategory,
  removeCategory,
  updateCategory,
} from "../controller/categoryController.js";


router.post(
  '/add',
  productRoute,
  allowTo('owner', 'admin', 'manage category'),
  addCategoryValidator,
  addCategory
);

router.get(
  '/one/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage category'),
  removeCategoryValidator,
  getSpecificCategory,
)

router.get(
  '/all',
  getAllCategory
);
router.patch(
  '/update/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage category'),
  updateCategoryValidator,
  updateCategory
);
router.delete(
  '/remove/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage category'),
  removeCategoryValidator,
  removeCategory
);

export default router;