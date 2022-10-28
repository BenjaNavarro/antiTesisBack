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

//api/pacients/new POST
PacientController.newPacient = async (req,res) => {
  try {
    console.log({body:req.body});
    const RUT = req.body.RUT;
    const pacient = await Pacient.findOne({RUT:RUT});
    if(pacient){
      return res
        .status(400)
        .send({ error: "User Rut already registered!" });
    }else{
      const {
        names,
        firstLastName,
        secondLastName,
        RUT,
        email
      } = req.body;
      const createdPacient = new Pacient(
        _.pickBy(
          {
            names,
            firstLastName,
            secondLastName,
            RUT,
            email
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
    res
      .status(500)
      .send({ name: error.name, info: error.message });
  }
}

module.exports = PacientController;