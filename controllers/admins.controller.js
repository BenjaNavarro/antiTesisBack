const AdminController = {};
const Admin = require('../models/Admin');
const _ = require('lodash');

AdminController.NewAdmin = async(req,res) => {
  try {
    const RUT = req.body.RUT;
    const admin = await Admin.findOne({RUT:RUT});
    if(admin){
      return res
        .status(400)
        .send({ error: "USER RUT ALREADY REGISTERED!" });
    }else{
      const {
        names,
        firstLastName,
        secondLastName,
        RUT,
        email,
        birthDate,
        gender,
        phone,
        password,
        password_confirmation
      } = req.body;
      const createdAdmin = new Admin(
        _.pickBy(
          {
            names,
            firstLastName,
            secondLastName,
            RUT,
            email,
            birthDate,
            gender,
            phone,
            password,
            password_confirmation
          },
          _.identity
        )
      );
      await createdAdmin.save();
      if(createdAdmin){
        console.log('ADMIN REGISTRATION SUCCESFULL!');
        return res.status(200).json({message:"newAdmin",Admin:createdAdmin,status:200});
      }
    }
  } catch (error) {
    console.log('TERAPIST REGISTRATION ERROR!',error);
    res
      .status(500)
      .send({ name: error.name, info: error.message });
  }
}