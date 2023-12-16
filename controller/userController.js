import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import BadRequest from '../errors/badRequest.js';
import { setPagination } from '../utils/pagination.js';
import { StatusCodes } from 'http-status-codes';
import { sanitizeData } from '../utils/sanitizeData.js';

export const changePassword = asyncHandler(async (req, res) => {

  const user = await User.findById(req.user._id);

  if (! await user.comparePass(req.body.currentPassword))
    throw new BadRequest('Current Password incorrect')

  user.password = req.body.newPassword;
  await user.hashedPass();

  user.passwordChangeAt = Date.now();
  await user.save();
  const token = user.createJWTForAuthorization();

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      token,
      user: sanitizeData(user),
    });
});

export const addAddresses = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: { address: req.body.address } },
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      addresses: user.addresses,
    });
});

export const getAllAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      count: user.addresses.length,
      addresses: user.addresses,
    });
});

export const removeAddresses = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    {
      _id: req.user._id
    },
    {
      $pull: { addresses: { _id: req.params.id } },
    },
    {
      new: true,
      returnDocument: true,
    }
  );

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      addresses: user.addresses,
    });
});

export const getAllUser = asyncHandler(async (req, res) => {
  const { limit, skip, pagination } = await setPagination(User, req);
  const regexPatternUser = req.query.user ? new RegExp(req.query.user, 'i') : /.*/;
  let allUser = await User.find({
    $or: [
      { firstName: { $regex: regexPatternUser } },
      { lastName: { $regex: regexPatternUser } },
    ]
  }).skip(skip).limit(limit);
  
  res.status(StatusCodes.OK).json({
    status: "Success",
    count: allUser.length,
    pagination,
    allUser
  });
});

// @desc Get 
export const getAllAdmins = asyncHandler(async (req, res) => { 
  let allAdmin = await User.find({}).populate({
    path: 'role',
    match: { permissions: { $ne: null } },
    select: '_id'
  }); 
  allAdmin.forEach((admin) => {
    allAdmin = allAdmin.filter((admin) => admin.role !== null)
  })
  res.status(StatusCodes.OK).json({
    status: "Success",
    count: allAdmin.length,
    allAdmin
  });
});

// @desc Delete Specific User
// @route /user/delete/:id
// @access Private/Owner/Admin/Manage User
export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// @desc Add Ban
// @route /user/add/ban/:id
// @access Private/Owner/Admin/Manage User
export const addBan = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.params.id,
    {
      banExpired: new Date(req.body.data),
      isBanned: true
    }
  );
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
    });
});

// @desc Remove Ban
// @route /user/remove/ban/:id
// @access Private/Owner/Admin/Manage User
export const removeBan = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.params.id,
    {
      banExpired: null,
      isBanned: false,
      banForever:false
    }
  );
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
    });
});

// @desc Add Ban Forever
// @route /user/add/ban/forever/:id
// @access Private/Owner/Admin/Manage User
export const addBanForever = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.params.id,
    {
      banForever: true
    }
  );
  res.status(StatusCodes.OK)
    .json({
      status: "Success"
    });
});

// 
export const aboutMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'role',
    select: 'permissions _id'
  });
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      user: sanitizeData(user)
    });
});

export const addRoleUser = asyncHandler(async (req, res) => {
  const user = await User.findOneAndUpdate(
    { _id: req.body.user },
    { role: req.body.role },
    { new: true, runValidators: true }
  ).populate({
    path: 'role',
    select: 'permissions -_id'
  });
  res.status(StatusCodes.OK).json({
    status: "Success",
    user: sanitizeData(user)
  });
});

export const removeRoleUser = asyncHandler(async (req, res) => { 
  const user = await User.findOneAndUpdate(
    { _id: req.body.user },
    { role: null },
    { new: true, runValidators: true }
  ).populate({
    path: 'role',
    select: 'permissions -_id'
  });
  res.status(StatusCodes.NO_CONTENT).send();
})
