import authRoute from './authRoute.js';
import userRoute from './userRoute.js';
import storeRoute from './storeRoute.js';
import categoryRoute from './categoryRoute.js'
import productRoute from './productRoute.js';
import cartRoute from './cartRoute.js';
import orderRoute from './oderRoute.js';
import sectionRoute from './sectionRoute.js'
import roleRoute from './roleRoute.js';

export default (app) => {
  app.use('/auth', authRoute);
  app.use('/user', userRoute);
  app.use('/store', storeRoute);
  app.use('/category', categoryRoute);
  app.use('/product', productRoute);
  app.use('/cart', cartRoute);
  app.use('/order', orderRoute);
  app.use('/homePage', sectionRoute);
  app.use('/role', roleRoute);
};