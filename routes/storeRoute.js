import { Router } from "express";
const router = Router();

import productRoute from '../middleware/authMiddleware.js';
import { allowTo } from "../controller/authController.js";
import {
  addStoreValidator,
  removeStoreValidator,
  updatedStoreValidator,
} from "../utils/validators/storeValidator.js";
import {
  addStore,
  getAllStore,
  getStore,
  removeStore,
  updatedStore,
} from "../controller/storeController.js";
import { uploadSingleImage } from "../middleware/uploadImageMiddleWare.js";


router.post(
  '/add',
  productRoute,
  allowTo('owner', 'admin', 'manage store'),
  uploadSingleImage('image', 'store'),
  addStoreValidator,
  addStore
);

router.patch(
  '/update/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage store'),
  uploadSingleImage('image', 'store'),
  updatedStoreValidator,
  updatedStore
);

router.get(
  "/one/:id",
  productRoute,
  allowTo('owner', 'admin', 'manage store'),
  removeStoreValidator,
  getStore
)
router.get(
  '/all',
  getAllStore
);
router.delete(
  '/remove/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage store'),
  removeStoreValidator,
  removeStore
);

export default router;