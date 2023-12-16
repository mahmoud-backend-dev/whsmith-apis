import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { setPagination } from '../utils/pagination.js';

// @desc Add Category
// @route POST  /category/add
// @access Protect/Admin/Manage Category
export const addCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(StatusCodes.CREATED).json({ status: "Success", category });
});

// @desc Update Category
// @route PATCH  /category/update/:id
// @access Protect/Admin/Manage Category
export const updateCategory = asyncHandler(async (req, res) => {
  const updateCategory = await Category.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true },
  );
  res.status(StatusCodes.OK).json({ status: "Success", updateCategory });
});


// @desc Get Specific Category
// @route POST  /category/one/:id
// @access Protect/Admin/Manage Category
export const getSpecificCategory = asyncHandler(async (req, res) => { 
  const category = await Category.findById(req.params.id);
  res.status(StatusCodes.OK).json({ status: "Success", category });
});

// @desc Get All Category
// @route POST  /category/all with pagination
// @access Protect/Admin/Manage Category
export const getAllCategory = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const regexPatternCategory = req.query.category ? new RegExp(req.query.category, 'i') : /.*/;
  const { skip, limit, pagination } = await setPagination(Category, req);

  const allCategory = await Category.find({
    isArchive: false,
    $or: [
      { "name.en": { $regex: regexPatternCategory } },
      { "name.ar": { $regex: regexPatternCategory } },
    ]
  }).skip(skip).limit(limit).select(`name.${lang}`);
  res.status(StatusCodes.OK).json({
    status: "Success",
    count: allCategory.length,
    pagination,
    allCategory
  });
});

// @desc Remove Category
// @route POST  /category/remove/:id
// @access Protect/Admin/Manage Category
export const removeCategory = asyncHandler(async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, { isArchive: true });
  const allProduct = await Product.find({ category: req.params.id, isArchive: false });
  await Promise.all(allProduct.map(async (pro) => {
    pro.isArchive = true;
    await pro.save()
  }));
  res.status(StatusCodes.NO_CONTENT).send();
});

