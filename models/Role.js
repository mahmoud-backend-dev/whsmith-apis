import { model, Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name role required']
  },
  permissions: {
    type: [{
      type: String,
      enum: [
        'owner',
        'admin',
        'manage home setting',
        'manage category',
        'manage store',
        'manage roles',
        'manage user',
        'manage order',
        'manage product',
      ],
      required:true
    }],
  },
  store: {
    type: Schema.Types.ObjectId,
    ref: 'Store',
  },
}, { timestamps: true });

roleSchema.pre(/^find/, function (next) {
  this.select('-__v -CreatedAt -UpdatedAt');
  next();
});

export default model('Role', roleSchema);