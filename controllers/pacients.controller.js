const PacientController = {};
const Pacient = require('../models/Pacient');
const _ = require('lodash');

//api/pacients GET
PacientController.getPacients = async (req,res) => {
  try{
    const pacients =await Pacient.find();
    console.log(pacients);
    if(!pacients){
      return res
        .status(404)
        .send({ error: "Pacients not found"})
    }else{
      return res
        .status(200)
        .send(pacients)
    }
  }catch{
    res
    .status(500)
    .send({ name: error.name, info: error.message })
  }

}

PacientController.Login = async (req,res) => {
  try {
    // console.log({body:req.body});
    const { rut, password } = req.body;
    const pacient = await Pacient.findByCredentials(rut,password);
    // console.log({pacient});
    if (pacient) {
      console.log('PACIENT LOGIN SUCCESFULL!');
      return res
      .status(200)
      .json({status:200,pacient:pacient});
    }else{
      console.log('PACIENT NOT FOUND!');
      return res
      .status(400)
      .json({status:400,message:'Pacient not found!'});
    }
  } catch (error) {
    console.log('PACIENT LOGIN ERROR!',error);
    res
    .status(500)
    .send({ name: error.name, info: error.message })
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
        return res.status(200).json({message:"newPacient",pacient:createdPacient,status:200});
      }
    }
  } catch (error) {
    console.log('PACIENT REGISTRATION ERROR!',error);
    res
    .status(500)
    .send({ name: error.name, info: error.message });
  }
}

module.exports = PacientController;