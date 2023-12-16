import { Router } from "express";
const router = Router();

import productRoute from '../middleware/authMiddleware.js';
import { allowTo } from "../controller/authController.js";
import { uploadArrayOfImages } from '../middleware/uploadImageMiddleWare.js';
import {
  addProductValidator,
  getSpecificProductValidator,
  updateProductValidator,
} from "../utils/validators/productValidator.js";
import {
  addProduct,
  getAllProduct,
  getAllProductWithSearch,
  getSpecificProduct,
  removeProduct,
  updateProduct,
} from "../controller/productController.js";

router.post(
  '/add',
  productRoute,
  allowTo('owner','admin', 'manage product'),
  uploadArrayOfImages('images','products'),
  addProductValidator,
  addProduct
);

router.get(
  '/all/dashboard',
  productRoute,
  allowTo('owner', 'admin', 'manage product', 'manage home setting'),
  getAllProductWithSearch
);

router.get('/all/:id', getAllProduct);

router.get('/one/:id', getSpecificProductValidator, getSpecificProduct);
router.patch(
  '/update/:id',
  productRoute,
  allowTo('owner','admin', 'manage product'),
  uploadArrayOfImages('images','products'),
  updateProductValidator,
  updateProduct
);

router.delete(
  '/remove/:id',
  productRoute,
  allowTo('owner','admin', 'manage product'),
  updateProductValidator,
  removeProduct,
)

export default router;