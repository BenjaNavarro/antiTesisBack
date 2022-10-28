const mongoose = require('mongoose');
const validator = require('validator');
const rut = require('rut.js');
const validate = rut.validate;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const clean = rut.clean;
const format = rut.format;

const PacientSchema = mongoose.Schema(
  {
    names:{
      type: String,
      required: true,
      trim: true
    },
    firstLastName:{
      type: String,
      required: true,
      trim: true
    },
    secondLastName:{
      type: String,
      required: true,
      trim: true
    },
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
          this.invalidate("sexo", "sex not found");
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
    state:{
      type: Boolean,
      default: true
    },
    type:{
      type:String,
      default:'pacient',
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
    terapist:{
      type: mongoose.Schema.Types.ObjectId,
      ref:'Terapist'
    }
  },
  {
    timestamps: true,
  }
);

PacientSchema.plugin(uniqueValidator);

PacientSchema.pre('validate',async function(next){
  const user = this;
  if(user.isModified('RUT')){
    user.RUT = clean(user.RUT);
  }
  if (user.password != user.password_confirmation) {
    this.invalidate("passwordConfirmation", "must match confirmation.");
  }
  next();
});

PacientSchema.pre('save',async function(next){
  const user = this;
  if(user.isModified('password')){
    if(user.password == user.password_confirmation){
      user.password = await bcrypt.hash(user.password,8);
      user.password_confirmation = user.password;
    }
  }
  next();
});

module.exports = mongoose.model('Pacient',PacientSchema);