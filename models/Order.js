import { model, Schema } from "mongoose";

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref:'User',
    required: [true, 'user required'],
  },
  cartItems: [{
    _id: false,
    product: {
      type: Schema.Types.ObjectId,
      required: [true, 'product required'],
      ref: 'Product'
    },
    name: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      }
    },
    description: {
      ar: {
        type: String,
      },
      en: {
        type: String,
      }
    },
    author: {
      ar: String,
      en: String
    },
    details: {
      ar: String,
      en: String
    },
    images: [{
      type: String,
      required: true,
    }],
    quantity: {
      type: Number,
    },
    priceAfterDiscount: {
      type: Number,
    },
    price: {
      type: Number,
    }
  }],
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
  },
  totalPriceOrder: {
    type: Number,
    required: [true, 'total PriceOrder'],
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processed', 'Delivered', 'UnDelivered', 'Canceled'],
    default: 'Pending',
  }
}, { timestamps: true });

orderSchema.set('strictPopulate', false);

orderSchema.pre(/^find/, function (next) {
  this.select("-__v -createdAt -updatedAt");
  next()
});

export default model('Order', orderSchema);