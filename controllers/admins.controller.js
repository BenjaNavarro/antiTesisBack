const AdminController = {};
const Admin = require('../models/Admin');
const _ = require('lodash');


//GET /api/admins
AdminController.GetAdmins = async(req,res) => {
  try{
    const admins = await Admin.find();
    if(!admins){
      return res
        .status(404)
        .send({ error: "Admins not found"})
    }
    else{
      return res
        .status(200)
        .send(admins)
    }
  }catch(error){
    console.log("Error ",error);
    res
    .status(500)
    .send({ name: error.name, info: error.message })
  }
  
}




// POST /api/admins/new_admin
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
        name,
        lastName,
        // secondLastName,
        RUT,
        email,
        birthDate,
        address,
        gender,
        phone,
        password,
        password_confirmation
      } = req.body;
      const createdAdmin = new Admin(
        _.pickBy(
          {
            name,
            lastName,
            // secondLastName,
            RUT,
            email,
            birthDate,
            address,
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

AdminController.Login = async(req,res) => {
  try {
    const { rut, password } = req.body;
    const admin = await Admin.findByCredentials(rut,password);
    if (admin) {
      console.log('ADMIN LOGIN SUCCESFULL!');
      return res
        .status(200)
        .json({status:200,admin:admin});
    } else {
      console.log('ADMIN NOT FOUND!');
      return res
      .status(400)
      .json({status:400,message:'Admin not found!'});
    }
  } catch (error) {
    console.log('ADMIN LOGIN ERROR!',error);
    res
      .status(500)
      .send({ name: error.name, info: error.message });
  }
}

module.exports = AdminController;