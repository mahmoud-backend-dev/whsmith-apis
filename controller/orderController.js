import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import NotFoundError from '../errors/notFound.js';
import Product from '../models/Product.js';
import { setPagination, setPaginationByArray } from '../utils/pagination.js';

// Protect/User
export const addOrder = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const cart = await Cart.findById(req.params.cartID).populate({
    path: 'cartItems.product',
    select: `name.${lang} description.${lang} author.${lang} details.${lang} images stores category`
  });
  if (!cart)
    throw new NotFoundError(`No cart for this cart id: ${req.params.cartID}`);
  
  const totalPriceOrder = cart.totalPrice;
  const order = await Order.create({
    user: req.user._id,
    store: cart.store,
    totalPriceOrder,
  });
  order.cartItems = cart.cartItems.map((item) => {
    const storePrice = item.product.stores
      .filter((ele) => ele.store.toString() === cart.store.toString())
    return {
      product: item.product._id,
      name: item.product.name,
      description: item.product.description,
      author: item.product.author,
      details: item.product.details,
      images: item.product.images,
      quantity: item.quantity,
      price: storePrice[0].price,
      priceAfterDiscount: storePrice[0].priceAfterDiscount,
    }
  });
  await order.save();
  if (order) {
    await Promise.all(cart.cartItems.map(async (item) => {
      await Product.findByIdAndUpdate(
        item.product,
        {
          $inc: { quantity: -item.quantity, sold: +item.quantity },
        }
      )
    }))
  };
  await Cart.findByIdAndDelete(req.params.cartID);

  res.status(StatusCodes.CREATED)
    .json({
      status: "Success",
      order,
    })
});

// Protect/User
export const getAllOrder = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const { skip, limit, pagination } = await setPagination(Order, req);
  const allOrder = await Order.find({
    user: req.user._id,
    status: { $in: ['Pending', 'Processed'] },
    isPaid: false
  }).populate({
    path: 'cartItems.product',
    select: `name.${lang} description.${lang} images stores`,
    populate: {
      path: 'stores.store',
      select: `name.${lang}`
    }
  })
    .limit(limit).skip(skip)
  allOrder.forEach((order) => {
    order.cartItems.forEach((item) => { 
      item.product.stores = item.product.stores.filter((ele) => 
        ele.store._id.toString() === item.store.toString()
      );
    })
  })
  
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      count: allOrder.length,
      pagination,
      allOrder,
    })
});

// Protect/Owner/Admin/Manage Order
export const updateStatusOrder = asyncHandler(async (req, res) => {
  const updatedOrder = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  );
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      updatedOrder
    });
});

// Protect/Owner/Admin/Manage Order
export const getAllOrderDashboard = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const regexPatternUser = req.query.user ? new RegExp(req.query.user, 'i') : /.*/;
  const regexPatternProduct = req.query.product ? new RegExp(req.query.product, 'i') : /.*/;
  const regexPatternStore = req.query.store ? new RegExp(req.query.store, 'i') : /.*/;
  const regexPatternCategory = req.query.category ? new RegExp(req.query.category, 'i') : /.*/;
  const queryFilter = {}
  if (req.user.role.store)
    queryFilter.store = req.user.role.store;
  queryFilter.status = { $in: ['Pending', 'Processed', 'UnDelivered'] };
  let allOrder = await Order.find(queryFilter).populate({
    path: 'user',
    select: 'firstName lastName',
    match: {
      $or: [
        { firstName: { $regex: regexPatternUser } },
        { lastName: { $regex: regexPatternUser } }
      ]
    }
  }).populate({
    path: 'store',
    select: `name.${lang}`,
    match: {
      $or: [
        { "name.en": { $regex: regexPatternStore } },
        { "name.ar": { $regex: regexPatternStore } },
      ]
    }
  }).populate({
      path: 'cartItems.product',
      select: `name.${lang} description.${lang} images stores`,
      populate: {
        path: 'stores.store',
        select: `name.${lang}`,
        match: {
          $or: [
            { "name.en": { $regex: regexPatternStore } },
            { "name.ar": { $regex: regexPatternStore } },
          ]
        }
      }
    }).populate({
    path: 'cartItems.category',
    select: `name.${lang}`,
    match: {
      $or: [
        { "name.en": { $regex: regexPatternCategory } },
        { "name.ar": { $regex: regexPatternCategory } },
      ]
    }
  })
    // .skip(skip).limit(limit);

  // Search By User
  allOrder.forEach((order) => {
    allOrder = allOrder.filter((item) => item.user !== null);
  });
  // Search By Store Admin
  allOrder.forEach((order) => {
    allOrder = allOrder.filter((item) => item.store !== null);
  });

  // Search By Store Category Product name or description
  allOrder.forEach((order) => {
    order.cartItems.forEach((item) => {
      item.product.stores = item.product.stores.filter((ele) => ele.store !== null);
      item.product.stores = item.product.stores
        .filter((ele) => ele.store._id.toString() === order.store._id.toString());
    }
    );
    // order.cartItems = order.cartItems.filter((item) => item.category !== null);
    order.cartItems = order.cartItems.filter(
      (item) => regexPatternProduct.test(item.name) || regexPatternProduct.test(item.description)
    );
  });

  const { skip, limit, pagination } = await setPaginationByArray(allOrder, req);
  allOrder = allOrder.slice(skip, skip + limit);

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      count: allOrder.length,
      pagination,
      allOrder
    });
});

export const getSpecificOrder = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const order = await Order.findById(req.params.id).populate({
    path: 'user',
    select:'firstName lastName'
  }).populate({
      path: 'cartItems.product',
    select: `name.${lang} description.${lang} author.${lang} details.${lang} images stores`,
      populate: {
        path: 'stores.store',
        select: `name.${lang}`
      }
    }).populate({
    path: 'cartItems.category',
    select: `name.${lang}`
    }).select('-cartItems.store')
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      order
    });
})

// Protect/Owner/Admin/Manage Order
export const removeOrder = asyncHandler(async (req, res) => {
  await Order.findByIdAndRemove(req.params.id);
  res.status(StatusCodes.NO_CONTENT).send();
});

// Protect/Owner/Admin/Manage Order
export const getAllOrderDAndC = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  
  const regexPatternUser = req.query.user ? new RegExp(req.query.user, 'i') : /.*/;
  const regexPatternProduct = req.query.product ? new RegExp(req.query.product, 'i') : /.*/;
  const regexPatternStore = req.query.store ? new RegExp(req.query.store, 'i') : /.*/;
  const regexPatternCategory = req.query.category ? new RegExp(req.query.category, 'i') : /.*/;
  const queryFilter = {}
  if (req.user.role.store)
    queryFilter.store = req.user.role.store;
  let allOrder = await Order.find({ status: { $in: ['Delivered', 'Canceled'] } }).populate({
    path: 'user',
    select: 'firstName lastName',
    match: {
      $or: [
        { firstName: { $regex: regexPatternUser } },
        { lastName: { $regex: regexPatternUser } }
      ]
    }
  }).populate({
    path: 'store',
    select: `name.${lang}`,
    match: {
      $or: [
        { "name.en": { $regex: regexPatternStore } },
        { "name.ar": { $regex: regexPatternStore } },
      ]
    }
  }).populate({
    path: 'cartItems.product',
    select: `name.${lang} description.${lang} images stores`,
    populate: {
      path: 'stores.store',
      select: `name.${lang}`,
      match: {
        $or: [
          { "name.en": { $regex: regexPatternStore } },
          { "name.ar": { $regex: regexPatternStore } },
        ]
      }
    }
  }).populate({
    path: 'cartItems.category',
    select: `name.${lang}`,
    match: {
      $or: [
        { "name.en": { $regex: regexPatternCategory } },
        { "name.ar": { $regex: regexPatternCategory } },
      ]
    }
  })
    //.skip(skip).limit(limit);
  // Search By User
  allOrder.forEach((order) => {
    allOrder = allOrder.filter((item) => item.user !== null);
  });
  // Search By Store Admin
  allOrder.forEach((order) => {
    allOrder = allOrder.filter((item) => item.store !== null);
  });

  // Search By Store Category Product name or description
  allOrder.forEach((order) => {
    order.cartItems.forEach((item) => {
      item.product.stores = item.product.stores.filter((ele) => ele.store !== null);
      item.product.stores = item.product.stores
        .filter((ele) => ele.store._id.toString() === order.store._id.toString());
    }
    );
    // order.cartItems = order.cartItems.filter((item) => item.category !== null);
    order.cartItems = order.cartItems.filter(
      (item) => regexPatternProduct.test(item.name) || regexPatternProduct.test(item.description)
    );
  });

  const { skip, limit, pagination } = await setPaginationByArray(allOrder, req);
  allOrder = allOrder.slice(skip, skip + limit);
  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      count: allOrder.length,
      pagination,
      allOrder
    });
});

export const deleteAllOrderDAndC = asyncHandler(async (req, res) => {
  await Order.deleteMany({ status: { $in: ['Delivered', 'Canceled'] } });
  res.status(StatusCodes.NO_CONTENT).send();
})
