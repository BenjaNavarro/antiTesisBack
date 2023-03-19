const mongoose = require('mongoose');
const validator = require('validator');
const rut = require('rut.js');
const validate = rut.validate;
const uniqueValidator = require('mongoose-unique-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {clean,format} = rut;

const TerapistSchema = mongoose.Schema(
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
        if (!validate(value)) {
          throw new Error({ error: "Invalid RUT Terapist!" });
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
      default:'terapist',
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
    pacients:[
      {
        onTherapy:{
          type:Boolean,
          default:false,
        },
        pacient:{
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Pacients'
        }
      }
    ],
  },
  {
    timestamps: true,
  }
);

TerapistSchema.plugin(uniqueValidator);

TerapistSchema.pre('validate',async function(next){
  const user = this;
  if(user.isModified('RUT')){
    user.RUT = clean(user.RUT);
  }
  if (user.password != user.password_confirmation) {
    this.invalidate("passwordConfirmation", "must match confirmation.");
  }
  next();
});

TerapistSchema.pre('save',async function(next){
  const user = this;
  if(user.isModified('password')){
    if(user.password == user.password_confirmation){
      user.password = await bcrypt.hash(user.password,8);
      user.password_confirmation = user.password;
    }
  }
  next();
});

TerapistSchema.statics.findByCredentials = async function (RUT, password){
  try {
    const user = await this.findOne({ RUT: rut.clean(RUT)}).exec();
    // console.log({user});
    if(user){
      const match = await bcrypt.compare(password,user.password);
      if(match){
        return user;
      }else{
        throw(new Error({message:'Incorrect Password',name:'password error'}))
      }
    }else{
      throw(new Error({name:'rut error',message:'Rut not Registered!'}));
    }
  } catch (error) {
    console.error({error});
    return error;
  }
};

TerapistSchema.methods.generateAuthToken = async function () {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign(
    { _id: user._id, tipo: user.type, email: user.email },
    process.env.JWT_KEY
  );
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

TerapistSchema.methods.LogoutTerapist = async function(tkn){
  const terapist = this;
  user.tokens = user.tokens.filter((token)=>{
    return token.token != tkn;
  });
  return await terapist.save();
};

TerapistSchema.methods.ChangeAuthToken = async function (tkn) {
  const terapist = this;
  console.log('first');
  terapist.tokens = terapist.tokens.filter((token) => {
    return token.token != tkn;
  });
  console.log('second');
  await terapist.save();
  console.log('third');
  const newToken = await terapist.generateAuthToken();
  console.log('fourth');
  return newToken;
};

  // TerapistSchema.methods.generateConfirmationToken = async function () {
  //   var token = jwt.sign({ email: this.email }, process.env.JWT_KEY);
  //   this.verification_data = { confirmationResetToken: token };
  //   await this.save();
  // };
  
// TerapistSchema.methods.LogoutUser = async function (bad_token) {
//   const user = this;
//   user.tokens = user.tokens.filter((token) => {
//     return token.token != bad_token;
//   });
//   return await user.save();
// };
  
module.exports = mongoose.model('Terapist',TerapistSchema);