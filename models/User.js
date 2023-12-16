import { Schema, model } from "mongoose";
import pkj from "jsonwebtoken";
const { sign } = pkj;
import bcrypt from 'bcryptjs';

const addressSchema = new Schema({
  address: {
    type: String,
  }
}); 

const userSchema = new Schema({

  firstName: {
    type: String,
    required: [true, 'firstName required'],
  },

  lastName: {
    type: String,
    required: [true, 'lastName required'],
  },

  email: {
    type: String,
    required: [true, 'email required'],
    unique: [true, 'email must be unique']
  },

  password: {
    type: String,
    minlength: [6, 'Too short password'],
    required: [true, 'password required'],
  },

  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    default:null
  },

  passwordChangeAt: Date,

  addresses: [addressSchema],

  resetCodeExpiredForSignup: Date,
  resetVerifyForSignup: Boolean,
  resetCodeExpiredForPassword: Date,
  resetVerifyForPassword: Boolean,

  banExpired: Date,
  isBanned: {
    type: Boolean,
    default:false
  },

  banForever: {
    type: Boolean,
    default: false
  },

}, { timestamps: true });

userSchema.pre(/^find/, function (next) {
  this.select("-__v -createdAt -updatedAt");
  next()
});

userSchema.pre('find', function (next) {
  this.select('-password');
  next();
});

userSchema.methods.createJWTForSignup = function () {
  return sign({
    userIdForSignup: 1,
    userId: this._id,
  },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )
};

userSchema.methods.createJWTForResetPassword = function () {
  return sign({
    userIdForResetPassword: 2,
    userId: this._id,
  },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h'
    }
  )
};

userSchema.methods.createJWTForAuthorization = function () {
  return sign({
    userId: this._id,
  },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  )
};


userSchema.methods.comparePass = async function (checkPass) {
  return await bcrypt.compare(checkPass, this.password);
};

userSchema.methods.hashedPass = async function () {
  this.password = await bcrypt.hash(this.password, 10);
};

export default model('User', userSchema);