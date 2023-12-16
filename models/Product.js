import { model, Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    ar: {
      type: String,
      required: [true, 'arabic name of product required'],
      minlength: [3, 'Too short arabic product name'],
      maxlength: [100, 'Too long arabic product name'],
    },
    en: {
      type: String,
      required: [true, 'english name of product required'],
      minlength: [3, 'Too short english product name'],
      maxlength: [100, 'Too long english product name'],
    }
  },
  description: {
    ar: {
      type: String,
      required: [true, 'Arabic product description is required'],
      minlength: [20, 'Too short arabic product description'],
    },
    en: {
      type: String,
      required: [true, 'English product description is required'],
      minlength: [20, 'Too short english product description'],
    }
  },
  author: {
    ar: String,
    en:String
  },
  details: {
    ar: String,
    en: String
  },
  images: [{
    type: String,
    required: true,
  }],
  stores: [
    {
      store: {
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: [true, 'Product must be belongs to store']
      },
      price: {
        type: Number,
        required: [true, 'price required']
      },
      priceAfterDiscount: {
        type: Number,
      },
      quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
      },
      sold: {
        type: Number,
        default: 0,
      },
      _id:false
    }
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Product must be belongs to category']
  },
  isArchive: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

productSchema.set('strictPopulate', false);

productSchema.pre(/^find/, function (next) {
  this.select("-__v -createdAt -updatedAt -isArchive");
  next()
});

export default model('Product', productSchema);