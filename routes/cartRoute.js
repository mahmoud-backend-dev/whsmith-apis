import { Router } from "express";
const router = Router();

import productRoute from '../middleware/authMiddleware.js';


import {
  addToCartValidator,
  removeCartValidator,
  updateCartValidator,
} from "../utils/validators/cartValidator.js";
import {
  addToCart,
  getAllCarts,
  removeCart,
  updateCartItemQuantity,
} from "../controller/cartController.js";

router.post('/add', productRoute, addToCartValidator, addToCart);
router.get('/all', productRoute,  getAllCarts);
router.patch('/update/:itemID', productRoute,  updateCartValidator, updateCartItemQuantity);
router.delete('/remove/:itemID', productRoute, removeCartValidator, removeCart);

export default router;