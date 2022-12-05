const PacientController = {};
const Pacient = require('../models/Pacient');
const Terapist = require('../models/Terapist')
const _ = require('lodash');

//api/pacients GET
PacientController.getPacients = async (req,res) => {
  try{
    const pacients =await Pacient.find();
    // console.log(pacients);
    if(!pacients){
      return res
        .status(404)
        .header({'x-auth-token':req.token})
        .send({ error: "Pacients not found"})
    }else{
      return res
        .status(200)
        .header({'x-auth-token':req.token})
        .json({pacients,status:200})
    }
  }catch(error){
    console.error({error});
    return res
      .status(500)
      .header({'x-auth-token':req.token})
      .send({ name: error.name, info: error.message });
  }
}

PacientController.getPacientsByTerapistId = async(req,res) => {
  try {
    const id = req.body.id;
    const terapist = await Terapist.findOne({_id:id});
    if(terapist){
      const pacients = await Pacient.find({terapist:id});
      return res
        .status(200)
        .header({'x-auth-token':req.token})
        .json({pacients,status:200});
    }else{
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({status:400,message:'terapist not found!'});
    }
  } catch (error) {
    console.error({error});
  }
}

PacientController.deletePacient = async(req,res) => {
  try {
    const id = req.params.id;
    const pacient = await Pacient.findOneAndDelete({_id:id});
    if(pacient){
      return res
        .status(200)
        .header({'x-auth-token':req.token})
        .json({status:200,pacient:pacient,message:'pacient deleted!'});
    }else{
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({status:400,message:'pacient deleted failed!'});
    }
  } catch (error) {
    console.error({error});
    return res
      .status(500)
      .header({'x-auth-token':req.token})
      .send({ name: error.name, info: error.message });
  }
}

PacientController.Login = async (req,res) => {
  try {
    // console.log({body:req.body});
    const { rut, password } = req.body;
    const pacient = await Pacient.findByCredentials(rut,password);
    // console.log({pacient});
    if (pacient) {
      // console.log('PACIENT LOGIN SUCCESFULL!');
      const token = await pacient.generateAuthToken();
      // console.log({token});
      return res
        .status(200)
        .header({'x-auth-token':token,status:200})
        .json({status:200,pacient});
    }else{
      // console.log('PACIENT NOT FOUND!');
      return res
      .status(400)
      .json({status:400,message:'Pacient not found!'});
    }
  } catch (error) {
    // console.log('PACIENT LOGIN ERROR!',error);
    res
      .status(500)
      .send({ name: error.name, info: error.message });
  }
}

PacientController.Logout = async (req,res) => {
  try {
    const pacient = await req.user.Logout(req.token);
    if(pacient){
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

//api/pacients/new POST
PacientController.newPacient = async (req,res) => {
  try {
    // console.log({body:req.body});
    const RUT = req.body.RUT;
    const pacient = await Pacient.findOne({RUT:RUT});
    if(pacient){
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
      const createdPacient = new Pacient(
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
      await createdPacient.save();
      if(createdPacient){
        console.log('PACIENT REGISTRATION SUCCESFULL!');
        return res
          .status(200)
          .json({message:"newPacient",pacient:createdPacient,status:200});
      }
    }
  } catch (error) {
    console.log('PACIENT REGISTRATION ERROR!',error);
    res
    .status(500)
    .send({ name: error.name, info: error.message });
  }
}

PacientController.PutPacient = async(req,res) => {
  try {
    const RUT = req.body.RUT;
    const pacient = await Pacient.findOne({RUT:RUT});
    if(pacient){
      return res
      .status(400)
      .header({'x-auth-token':req.token})
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
      const createdPacient = new Pacient(
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
      await createdPacient.save();
      if(createdPacient){
        console.log('PACIENT REGISTRATION SUCCESFULL!');
        return res
          .status(200)
          .header({'x-auth-token':req.token})
          .json({message:"newPacient",pacient:createdPacient,status:200});
      }
    }
  } catch (error) {
    console.error({error});
    return res
      .status(500)
      .header({'x-auth-token':req.token})
      .send({ name: error.name, info: error.message });
  }
}

module.exports = PacientController;