import { model, Schema } from "mongoose";

const cartSchema = new Schema({
  cartItems: [{
    _id: false,
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'product required'],
      ref: 'Product'
    },
    quantity: {
      type: Number,
      default: 1
    },
  }],
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
  },
  totalPrice: {
    type: Number,
    required: [true, 'totalPrice required']
  },
  user: {
    type: Schema.Types.ObjectId,
    required: [true, 'user required'],
    ref: 'User',
  },
}, { timestamps: true });

cartSchema.set('strictPopulate', false);

cartSchema.pre(/^find/, function (next) {
  this.select("-__v -createdAt -updatedAt -isArchive");
  next()
});

export default model('Cart', cartSchema);
