import { Router } from "express";
const router = Router();

import productRoute from '../middleware/authMiddleware.js';
import { allowTo } from "../controller/authController.js";

import {
  addOrder,
  deleteAllOrderDAndC,
  getAllOrder,
  getAllOrderDAndC,
  getAllOrderDashboard,
  getSpecificOrder,
  removeOrder,
  updateStatusOrder,
} from "../controller/orderController.js";
import {
  removeOrderValidator,
  updateStatusOrderValidator
} from "../utils/validators/orderValidator.js";

router.post('/add/:cartID', productRoute, addOrder);
router.get('/all', productRoute, getAllOrder);

router.patch(
  '/dashboard/update/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage order'),
  updateStatusOrderValidator,
  updateStatusOrder
);

router.get('/dashboard/all', productRoute, allowTo('owner', 'admin', 'manage order'), getAllOrderDashboard);

router.get(
  '/dashboard/:id',
  productRoute,
  removeOrderValidator,
  getSpecificOrder
);

router.delete(
  '/dashboard/remove/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage order'),
  removeOrderValidator,
  removeOrder
);

router.get(
  '/dashboard/get/all/delivered-canceled',
  productRoute,
  allowTo('owner', 'admin', 'manage order'),
  getAllOrderDAndC
);

router.delete(
  '/dashboard/remove/all/delivered-canceled',
  productRoute,
  allowTo('owner', 'admin', 'manage order'),
  deleteAllOrderDAndC
)
export default router;