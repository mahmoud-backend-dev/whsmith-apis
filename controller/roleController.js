import { StatusCodes } from 'http-status-codes';
import asyncHandler from 'express-async-handler';
import Role from '../models/Role.js';
import User from '../models/User.js';
import { setPagination } from '../utils/pagination.js';

export const addRole = asyncHandler(async (req, res) => {
  if (req.body.store) {
    const role = await Role.create({
      name: req.body.name,
      permissions: req.body.permissions,
      store: req.body.store
    });
    return res.status(StatusCodes.CREATED).json({
      status: "Success",
      role
    });
  }
  const role = await Role.create({
    name: req.body.name,
    permissions: req.body.permissions
  });
  res.status(StatusCodes.CREATED).json({
    status: "Success",
    role
  });
});

export const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      permissions: req.body.permissions,
      store: req.body.store
    },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      role
    });
});

export const removeRole = asyncHandler(async (req, res) => {
  await Role.findByIdAndRemove(req.params.id);
  await User.findOneAndUpdate(
    { role: req.params.id },
    { role:null },
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.NO_CONTENT).send();
});

export const addAdminRole = asyncHandler(async (req, res) => {
  const role = await Role.create({
    name: 'admin', // req.body.name,
    permissions: ['admin']
  });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: role._id },
    { new: true, runValidators: true },
  );
  res.status(StatusCodes.OK)
    .json({
      status: 'Success',
      user,
    });
});

export const removeAdminRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: null },
    { new: true, runValidators: true },
  );
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      user
    });
});

export const addOwnerRole = asyncHandler(async (req, res) => {
  const role = await Role.create({
    name: 'owner', // req.body.name
    permissions: ['owner']
  });
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: role._id },
    { new: true, runValidators: true },
  );
  res.status(StatusCodes.OK)
    .json({
      status: 'Success',
      user,
    });
});

export const removeOwnerRole = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: null },
    { new: true, runValidators: true },
  );
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      user
    });
});

export const getAllRoles = asyncHandler(async (req, res) => {
  const { limit, pagination, skip } = await setPagination(Role, req);
  const allRoles = await Role.find({})
    .limit(limit).skip(skip);
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      count: allRoles.length,
      pagination,
      allRoles
    });
})