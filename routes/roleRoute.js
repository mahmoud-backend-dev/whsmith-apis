import { Router } from "express";
const router = Router();

import productRoute from '../middleware/authMiddleware.js';
import { allowTo } from "../controller/authController.js";
import {
  addAdminRoleValidator,
  addOwnerRoleValidator,
  addRoleValidator,
  removeAdminRoleValidator,
  removeOwnerRoleValidator,
  removeRoleValidator,
  updateRoleValidator
} from "../utils/validators/roleValidator.js";
import {
  addAdminRole,
  addOwnerRole,
  addRole,
  removeAdminRole,
  removeOwnerRole,
  removeRole,
  updateRole,
  getAllRoles
} from "../controller/roleController.js";


router.post(
  '/add',
  productRoute,
  allowTo('owner', 'admin', 'manage roles'),
  addRoleValidator,
  addRole
);
router.patch(
  '/update/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage roles'),
  updateRoleValidator,
  updateRole
);
router.delete(
  '/remove/:id',
  productRoute,
  allowTo('owner', 'admin', 'manage roles'),
  removeRoleValidator,
  removeRole
);

router.post(
  '/add/admin/:id',
  productRoute,
  allowTo('owner','admin'),
  addAdminRoleValidator,
  addAdminRole
);

router.delete(
  '/remove/admin/:id',
  productRoute,
  allowTo('owner', 'admin'),
  removeAdminRoleValidator,
  removeAdminRole,
);

router.post(
  '/add/owner/:id',
  productRoute,
  allowTo('owner'),
  addOwnerRoleValidator,
  addOwnerRole
);

router.delete(
  '/remove/owner/:id',
  productRoute,
  allowTo('owner'),
  removeOwnerRoleValidator,
  removeOwnerRole
);

router.get(
  "/all",
  productRoute,
  allowTo('owner', 'admin', 'manage roles'),
  getAllRoles,
)

export default router;