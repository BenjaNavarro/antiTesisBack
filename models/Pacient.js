const mongoose = require('mongoose');

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
      /*
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new Error({ error: "Invalid Email address" });
        }
      },*/
    },
    RUT:{
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      /*
      validate: (value) => {
        if (!validate(value)) {
          throw new Error({ error: "Invalid RUT Pacient!" });
        }
      },
      */
    },

  }
)

module.exports = mongoose.model('Pacient',PacientSchema);