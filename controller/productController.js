import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import {unlink} from 'fs/promises';
import Product from '../models/Product.js';
import { setPaginationByArray } from '../utils/pagination.js';
import Cart from '../models/Cart.js';
import BadRequest from '../errors/badRequest.js';

export const addProduct = asyncHandler(async (req, res) => {
  req.body.images = req.files.map((img) => `${process.env.BASE_URL}/products/${img.filename}`);
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ status: "Success", product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  let updateProduct = await Product.findById(req.params.id);
  if (req.files.length > 0) {
    await Promise.all(updateProduct.images.map(async (img) => {
      await unlink(`./uploads/products/${img.split('/')[4]}`);
    }));
    req.body.images = req.files.map((img) => `${process.env.BASE_URL}/products/${img.filename}`);
  }
  if (req.body.stores) {
    const carts = await Cart.find({ cartItems: { $elemMatch: { product: req.params.id } } });
    if (carts.length > 0)
      throw new BadRequest('You can\'t update product store because it\'s in cart');
  }

  updateProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
  );
  res.status(StatusCodes.OK).json({ status: "Success", updateProduct });
});

// Specific Store
export const getAllProduct = asyncHandler(async (req, res) => {

  const minPrice = req.query.minPrice | null
  const maxPrice = req.query.maxPrice | null
  const regexPatternProduct = req.query.product ? new RegExp(req.query.product, 'i') : /.*/;
  const regexPatternCategory = req.query.category ? new RegExp(req.query.category, 'i') : /.*/;

  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";

  let allProduct = await Product.find({
    isArchive: false,
    stores: { $elemMatch: { store: req.params.id } },
    $or: [
      { "name.en": { $regex: regexPatternProduct } },
      { "description.en": { $regex: regexPatternProduct } },
      { "name.ar": { $regex: regexPatternProduct } },
      { "description.ar": { $regex: regexPatternProduct } },
    ],
  }).populate({
    path: 'stores.store',
    select: `name.${lang}`
  }).populate({
    path: 'category',
    select: `name.${lang}`,
    match: {
      $or: [
        { "name.en": { $regex: regexPatternCategory } },
        { "name.ar": { $regex: regexPatternCategory } },
      ],
    }
  })
    .select(`images stores.price name.${lang} description.${lang} author.${lang} details.${lang}`);

  allProduct = allProduct.flatMap((product) => {
    const matchingStores = product.stores.filter(
      (store) => store.store._id.toString() === req.params.id
    );
    if (matchingStores.length > 0) {
      return matchingStores.map((store) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        quantity: product.quantity,
        author: product.author,
        details: product.details,
        images: product.images,
        store: store,
        category: product.category,
      }));
    }
    return [];
  });


  allProduct = allProduct.filter((product) => {
    if (minPrice && !maxPrice) {
      return product.store.price >= minPrice;
    }
    if (minPrice && maxPrice) {
      return product.store.price >= minPrice && product.store.price <= maxPrice;
    }
    return true;
  });


  // To remove product that not contain query filter by category
  allProduct = allProduct.filter((product) => product.category !== null);

  const { skip, limit, pagination } = await setPaginationByArray(allProduct, req);
  allProduct = allProduct.slice(skip, skip + limit);
  
  res.status(StatusCodes.OK).json({
    status: "Success",
    count: allProduct.length,
    pagination,
    allProduct
  });
});

export const removeProduct = asyncHandler(async (req, res) => {
  await Product.findByIdAndUpdate(req.params.id, { isArchive: true });
  const removeCart = await Cart.find({ cartItems: { $elemMatch: { product: req.params.id } } });
  removeCart.forEach((cart) => {
    cart.cartItems = cart.cartItems.filter((item) => item.product != req.params.id);
    cart.save()
  });
  res.status(StatusCodes.NO_CONTENT).send()
});

export const getSpecificProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'stores.store',
    select: 'name -_id'
  });
  res.status(StatusCodes.OK).json({
    status: "Success",
    product
  });
});

export const getAllProductWithSearch = asyncHandler(async (req, res) => {
  const minPrice = req.query.minPrice | null
  const maxPrice = req.query.maxPrice | null
  const regexPatternProduct = req.query.product ? new RegExp(req.query.product, 'i') : /.*/;
  const regexPatternStore = req.query.store ? new RegExp(req.query.store, 'i') : /.*/;
  const regexPatternCategory = req.query.category ? new RegExp(req.query.category, 'i') : /.*/;

  let allProduct = await Product.find({
    isArchive: false,
    $or: [
      { "name.en": { $regex: regexPatternProduct } },
      { "description.en": { $regex: regexPatternProduct } },
      { "name.ar": { $regex: regexPatternProduct } },
      { "description.ar": { $regex: regexPatternProduct } },
    ],
  }).populate({
      path: 'stores.store',
      select: `name`,
      match: {
        $or: [
          { "name.en": { $regex: regexPatternStore } },
          { "name.ar": { $regex: regexPatternStore } },
        ],
      }
    }).populate({
      path: 'category',
      select: `name`,
      match: {
        $or: [
          { "name.en": { $regex: regexPatternCategory } },
          { "name.ar": { $regex: regexPatternCategory } },
        ],
      } 
    }) // .skip(skip)
      //  .limit(limit)
    .select(`stores images name description author details`);

  // Filter out null values from the populated 'stores' array
  allProduct.forEach(product => {
    product.stores = product.stores.filter(store => store.store !== null);
    if (minPrice && !maxPrice) {
      product.stores = product.stores
        .filter(item => item.price >= minPrice)
    }
    if (minPrice && maxPrice) {
      product.stores = product.stores
        .filter(store => store.price >= minPrice && store.price <= maxPrice)
    }
  });

  // To remove product that not contain query filter by store
  allProduct = allProduct.filter((product) => product.stores.length > 0);

  // To remove product that not contain query filter by category  
  allProduct = allProduct.filter((product) => product.category !== null);

  const { skip, limit, pagination } = await setPaginationByArray(allProduct, req);
  allProduct = allProduct.slice(skip, skip + limit);  

  res.status(StatusCodes.OK).json({
    status: "Success",
    count: allProduct.length,
    pagination,
    allProduct,
  });
});
