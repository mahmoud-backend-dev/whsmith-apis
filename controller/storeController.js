import asyncHandler from 'express-async-handler'; 
import { StatusCodes } from 'http-status-codes';
import Store from '../models/Store.js';
import Product from '../models/Product.js';
import { setPagination } from '../utils/pagination.js';
import fs from 'fs/promises';

export const addStore = asyncHandler(async (req, res) => {
  req.body.image = `${process.env.BASE_URL}/store/${req.file.filename}`
  const store = await Store.create(req.body);
  res.status(StatusCodes.CREATED).json({ status: "Success", store });
});

export const updatedStore = asyncHandler(async (req, res) => { 
  if (req.file) {
    const store = await Store.findById(req.params.id);
    await fs.unlink(`./uploads/store/${store.image.split('/')[4]}`)
    req.body.image = `${process.env.BASE_URL}/store/${req.file.filename}`
  }
  const store = await Store.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.status(StatusCodes.OK).json({ status: "Success", store });
})

export const getStore = asyncHandler(async (req, res) => { 
  const store = await Store.findById(req.params.id);
  res.status(StatusCodes.OK).json({ status: "Success", store });
});

export const getAllStore = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const regexPatternStore = req.query.store ? new RegExp(req.query.store, 'i') : /.*/;
  const { limit, skip, pagination } = await setPagination(Store, req);
  const allStore = await Store.find({
    isArchive: false,
    $or: [
      { "name.en": { $regex: regexPatternStore } },
      { "name.ar": { $regex: regexPatternStore } }
    ]
  }).skip(skip).limit(limit).select(`name.${lang} region.${lang} city.${lang} image`);
  res.status(StatusCodes.OK).json({
    status: "Success",
    count: allStore.length,
    pagination,
    allStore
  });
});

export const removeStore = asyncHandler(async (req, res) => {
  const store = await Store.findByIdAndUpdate(req.params.id, { isArchive: true });
  await fs.unlink(`./uploads/store/${store.image.split('/')[4]}`);
  const allProduct = await Product.find({ "stores.store": store._id, isArchive: false });
  await Promise.all(allProduct.map(async (pro) => {
    pro.stores = pro.stores.filter((ele) => ele.store.toString() !== store._id.toString());
    if (pro.stores.length === 0)
        pro.isArchive = true;
    await pro.save()
  }));
  res.status(StatusCodes.NO_CONTENT).send();
});

