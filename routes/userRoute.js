import { Router } from "express";
const router = Router();

import { allowTo } from "../controller/authController.js";
import protectRoutes from "../middleware/authMiddleware.js";

import {
  addBanTimeValidator,
  addRoleUserValidator,
  banUserValidator,
  changePasswordValidator,
  deleteUserValidator,
  removeRoleUserValidator,
} from "../utils/validators/userValidator.js";

import {
  aboutMe,
  addBan,
  addBanForever,
  addRoleUser,
  changePassword,
  deleteUser,
  getAllAdmins,
  getAllUser,
  removeBan,
  removeRoleUser,
} from "../controller/userController.js";


router.patch('/changePassword', protectRoutes, changePasswordValidator, changePassword);

// router.post('/address/add', protectRoutes, allowTo('user'), addAddressValidator, addAddresses);
// router.delete('/address/remove/:id', protectRoutes, allowTo('user'), removeAddressValidator, removeAddresses);
// router.get('/address/all', protectRoutes, allowTo('user'), getAllAddress);

router.get('/all', protectRoutes, allowTo('owner', 'admin', 'manage user', 'manage roles'), getAllUser);
router.get('/all/admin', protectRoutes, allowTo('owner', 'admin'), getAllAdmins);

router.delete(
  '/delete/:id',
  protectRoutes,
  allowTo('owner','admin', 'manage user'),
  deleteUserValidator,
  deleteUser
);

router.post(
  '/add/ban/:id',
  protectRoutes,
  allowTo('owner', 'admin', 'manage user'),
  addBanTimeValidator,
  addBan
);

router.post(
  '/add/ban/forever/:id',
  protectRoutes,
  allowTo('owner', 'admin', 'manage user'),
  banUserValidator,
  addBanForever
);

router.delete(
  '/remove/ban/:id',
  protectRoutes,
  allowTo('owner', 'admin', 'manage user'),
  banUserValidator,
  removeBan
);

router.get(
  "/me",
  protectRoutes,
  aboutMe,
);

router.post(
  '/add/role',
  protectRoutes,
  allowTo('owner', 'admin', 'manage roles'),
  addRoleUserValidator,
  addRoleUser
);

router.patch(
  '/remove/role',
  protectRoutes,
  allowTo('owner', 'admin', 'manage roles'),
  removeRoleUserValidator,
  removeRoleUser
)

export default router;