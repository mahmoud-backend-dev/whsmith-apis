import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import NotFoundError from '../errors/notFound.js';
import BadRequest from '../errors/badRequest.js';


const calcTotalCartPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    if (item.product.stores[0].priceAfterDiscount)
      totalPrice += item.quantity * item.product.stores[0].priceAfterDiscount;  
    else
      totalPrice += item.quantity * item.product.stores[0].price;
  });
  cart.totalPrice = totalPrice;
}

// @desc Add Product To Cart
// @route POST  /cart/add
// @access Protect/User
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity, store } = req.body;

  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
      lang = "en";
  
  // Get Product
  const product = await Product.findById(productId);
  
  product.stores.forEach((pro) => { 
    if(pro.store.toString() === store)
      if(quantity > pro.quantity)
        throw new BadRequest('No quantity in stock')
  })
  const price = product.stores.find((ele) => ele.store == store);
  // Get User Cart
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [{
        product: productId,
        quantity: quantity == undefined ? 1 : quantity,
      }],
      store: store,
      totalPrice: quantity == undefined ? price.price : price.price * quantity,
    });
    cart = await cart.populate({
      path: 'cartItems.product',
      select: `name.${lang} description.${lang} author.${lang} details.${lang} images stores category`
    });
    cart.cartItems.forEach((item) => {
      if (item.product._id.toString() === productId)
        item.product.stores = item.product.stores.filter((ele) =>
          ele.store.toString() === store
        ).map((ele) => ({ store: ele.store, price: ele.price,priceAfterDiscount:ele.priceAfterDiscount }));
    });
  } else {
    const productIndex = cart.cartItems.findIndex((item) => item.product.toString() === productId);
    if (productIndex > -1) {
      if (store !== cart.store.toString()) {
        throw new BadRequest('You can not add product from another store')
      }
      if (quantity) {
        cart.cartItems[productIndex].quantity += quantity;
      } else {
        cart.cartItems[productIndex].quantity += 1;
      }
    } else {
      if (store !== cart.store.toString()) {
        throw new BadRequest('You can not add product from another store')
      }
      cart.cartItems.push({
        product: productId,
        quantity: quantity == undefined ? 1 : quantity,
      })
    }
    cart = await cart.populate({
      path: 'cartItems.product',
      select: `name.${lang} description.${lang} author.${lang} details.${lang} images stores category`
    });
    cart.cartItems.forEach((item) => {
        item.product.stores = item.product.stores.filter((ele) =>
          ele.store.toString() === store
        ).map((ele) => ({ store: ele.store, price: ele.price,priceAfterDiscount:ele.priceAfterDiscount }));
    });
  };
  calcTotalCartPrice(cart);

  await cart.save();

  res
    .status(StatusCodes.CREATED)
    .json({
      status: "Success",
      numOfCartItems: cart.cartItems.length,
      cart,
    });
});

// @desc Get All Products Of Cart
// @route GET  /cart/all
// @access Protect/User
export const getAllCarts = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const cart = await Cart.findOne({ user: req.user._id })
    .populate({
      path: 'cartItems.product',
      select: `name.${lang} description.${lang} author.${lang} details.${lang} images stores category`,
      populate: {
        path: 'category',
        select: `name.${lang}`
      }
    });
  if (!cart)
    throw new NotFoundError(`There is no cart for this user id: ${req.user._id}`)
  cart.cartItems.forEach((item) => {
    item.product.stores = item.product.stores.filter(
      (ele) => ele.store.toString() === cart.store.toString()
    ).map((ele) => ({ store: ele.store, price: ele.price,priceAfterDiscount:ele.priceAfterDiscount })); 
  })
  calcTotalCartPrice(cart);

  await cart.save();

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      numOfCartItems: cart.cartItems.length,
      cartId: cart._id,
      allCarts: cart.cartItems,
      totalPrice: cart.totalPrice,
    });
});

// @desc Update Cart Item Quantity
// @route GET  /cart/update/:itemID
// @access Protect/User
export const updateCartItemQuantity = asyncHandler(async (req, res) => {
  let lang = req.headers['accept-language'];
  if (!req.headers['accept-language'])
    lang = "en";
  const cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'cartItems.product',
    select: `name.${lang} description.${lang} author.${lang} details.${lang} images stores category`
  });
  cart.cartItems.forEach((item) => { 
    item.product.stores = item.product.stores.map(
      ele => ({ store: ele.store, price: ele.price,priceAfterDiscount:ele.priceAfterDiscount })
    );
  })
  const product = await Product.findById(req.params.itemID);
  if (!cart)
    throw new NotFoundError(`No cart for this user id: ${req.user._id}`);
  if (!product)
    throw new NotFoundError(`No product for this id: ${req.params.itemID}`);
  product.stores.forEach((pro) => {
    if (pro.store.toString() === cart.store.toString())
      if (req.body.quantity > pro.quantity)
        throw new BadRequest('No quantity in stock')
  })
  const productIndex = cart.cartItems
    .findIndex((item) => item.product._id.toString() === req.params.itemID);
  if (productIndex > -1) {
    cart.cartItems[productIndex].quantity = req.body.quantity;
    calcTotalCartPrice(cart)
    await cart.save();
  } else {
    throw new NotFoundError(`No product Item for this id: ${req.params.itemID} in this cart`);
  };
  res.status(StatusCodes.OK).json({
    status: "Success",
    numOfCartItems: cart.cartItems.length,
    updateCart: cart,
  })
});

// @desc Remove Cart
// @route GET  /cart/remove/:itemID
// @access Protect/User
export const removeCart = asyncHandler(async (req, res) => {

  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id
    },
    {
      $pull: { cartItems: { product: req.params.itemID } },
    },
    {
      new: true,
      runValidators:true,
    }
  );

  if (cart.cartItems.length === 0) {
    await Cart.findByIdAndDelete(cart._id);
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  res.status(StatusCodes.OK)
    .json({
      status: "Success",
      numOfCartItems: cart.cartItems.length,
      cart
    });
});



