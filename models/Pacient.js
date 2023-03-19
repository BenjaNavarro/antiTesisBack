const mongoose = require('mongoose');
const validator = require('validator');
const rut = require('rut.js');
// const validate = rut.validate;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {clean,format} = rut;

const PacientSchema = mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
      trim: true
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
        if (!rut.validate(value)) {
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
    verification_data: [
      {
        confirmationResetToken: {
          type: String,
        },
        confirmationResetExpires: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
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
    user.RUT = rut.clean(user.RUT);
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

PacientSchema.statics.findByCredentials = async function (RUT, password){
  try {
    const user = await this.findOne({ RUT: rut.clean(RUT)}).exec();
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

PacientSchema.methods.LogoutPacient = async function(tkn){
  const pacient = this;
  user.tokens = user.tokens.filter((token)=>{
    return token.token != tkn;
  });
  return await pacient.save();
};

PacientSchema.methods.generateAuthToken = async function(){
  // console.log('generate auth token');
  const user = this;
  // console.log('JWT KEY',process.env.JWT_KEY);
  const token = jwt.sign(
    {_id:user._id, type:user.type,email:user.email},process.env.JWT_KEY
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
}

module.exports = mongoose.model('Pacient',PacientSchema);