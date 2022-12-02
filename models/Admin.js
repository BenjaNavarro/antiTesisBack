const mongoose = require('mongoose');
const validator = require('validator');
const rut = require('rut.js');
const validate = rut.validate;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const clean = rut.clean;
const format = rut.format;

const AdminSchema = mongoose.Schema(
  {
    name:{
      type:String,
      required:true,
    },
    lastName:{
      type: String,
      required: true,
      trim: true
    },
    // secondLastName:{
    //   type: String,
    //   required: true,
    //   trim: true
    // },
    email:{
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },
    },
    RUT:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: (value) => {
        if (!validate(value)) {
          throw new Error({ error: "Invalid RUT Pacient!" });
        }
      },
    },
    phone:{
      type:Number,
      trim:true
    },
    gender:{
      type:String,
      trim: true,
      lowercase: true,
      validate: (value) => {
        if (value != "male" && value != "female") {
          this.invalidate("gender", "sex not found");
        }
      },
    },
    birthDate:{
      type: Date,
    // required: true,
      trim: true,
      validate: (value) => {
        if (value >= new Date()) {
          throw new Error({
            error: "Invalid Date!.",
          });
        }
      },
    },
    address:{
      type:String,
      trim:true,
      lowercase:true,
    },
    state:{
      type: Boolean,
      default: true
    },
    type:{
      type:String,
      default:'admin',
      enum:['terapist','admin','pacient']
    },
    password: {
      type: String,
      // required: true,
      minLength: 7,
    },
    password_confirmation: {
      type: String,
      // required: true,
      minLength: 7,
    },
    // verification_data: [
    //   {
    //     confirmationResetToken: {
    //       type: String,
    //     },
    //     confirmationResetExpires: {
    //       type: Date,
    //       default: Date.now,
    //     },
    //   },
    // ],
    // tokens: [
    //   {
    //     token: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    // ],
  },
  {
    timestamps: true,
  }
);

AdminSchema.plugin(uniqueValidator);

AdminSchema.pre('validate',async function(next){
  const user = this;
  if(user.isModified('RUT')){
    user.RUT = clean(user.RUT);
  }
  if (user.password != user.password_confirmation) {
    this.invalidate("passwordConfirmation", "must match confirmation.");
  }
  next();
});

AdminSchema.pre('save',async function(next){
  const user = this;
  if(user.isModified('password')){
    if(user.password == user.password_confirmation){
      user.password = await bcrypt.hash(user.password,8);
      user.password_confirmation = user.password;
    }
  }
  next();
});

AdminSchema.statics.findByCredentials = async function (RUT, password){
  try {
    const user = await this.findOne({ RUT: clean(RUT)}).exec();
    // console.log({user});
    if(user){
      const match = await bcrypt.compare(password,user.password);
      if(match){
        return user;
      }else{
        const err = new Error('Incorrect Password');
      }
    }else{
      const err = new Error('Rut not Registered!');
    }
  } catch (error) {
    console.log({error});
    return error;
  }
};

module.exports = mongoose.model('Admin',AdminSchema);