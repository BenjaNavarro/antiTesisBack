const AdminController = {};
const Admin = require('../models/Admin');
const _ = require('lodash');


//GET /api/admins
AdminController.GetAdmins = async(req,res) => {
  try{
    const admins = await Admin.find();
    if(!admins){
      return res
        .status(400)
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
        // console.log('ADMIN REGISTRATION SUCCESFULL!');
        return res.status(200).json({message:"newAdmin",Admin:createdAdmin,status:200});
      }
    }
  } catch (error) {
    console.error({error});
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
      const token = await admin.generateAuthToken();
      return res
        .status(200)
        .header({'x-auth-token':token})
        .json({status:200,admin:admin});
    } else {
      return res
        .status(400)
        .json({status:400,message:'Admin not found!'});
    }
  } catch (error) {
    console.error({error});
    res
      .status(500)
      .send({ name: error.name, info: error.message });
  }
}

AdminController.Logout = async (req,res) => {
  try {
    const admin = await req.user.LogoutAdmin(req.token);
    if(admin){
      return res.status(200).json({message:'logout soccesfull!',status:200});
    }else{
      throw(new Error({message:'Error! El controlador no pudo cerrar cesion!',name:'Logout Error'}));
    }
  } catch (error) {
    console.error({error});
    res
      .status(500)
      .send({ name: error.name, info: error.message });
  }
}

AdminController.Update = async (req,res) => {
  try {
    const adminId = req.params.id;
    const UpdateOps = req.body.User;
    Admin.findOneAndUpdate({_id:adminId},{$set:UpdateOps},{new:true},(err,result) => {
      if(err){
        // console.log({err});
        return res
          .status(400)
          .header({'x-auth-token':req.token})
          .json({ message: "Ha ocurrido un error", error: err });
      }else{
        // console.log({result});
        // console.log({token:req.token});
        return res
          .status(200)
          .header({'x-auth-token':req.token})
          .json({message: 'User updated',user: result});
      }
    });
  } catch (error) {
    console.error({error});
    res
    .status(500)
    .header({'x-auth-token':req.token})
    .send({ name: error.name, info: error.message });
  }
}

module.exports = AdminController;