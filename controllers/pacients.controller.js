const PacientController = {};
const Pacient = require('../models/Pacient');
const _ = require('lodash');

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
      const createdPacient = new Pacient(
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