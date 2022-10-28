const TerapistController = {};
const Terapist = require('../models/Terapist');
const _ = require('lodash');

TerapistController.NewTerapist = async(req,res) => {
  try {
    const RUT = req.body.RUT;
    const terapist = await Terapist.findOne({RUT:RUT});
    if(terapist){
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
      const createdTerapist = new Terapist(
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
      await createdTerapist.save();
      if(createdTerapist){
        console.log('TERAPIST REGISTRATION SUCCESFULL!');
        return res.status(200).json({message:"newTerapist",terapist:createdTerapist,status:200});
      }
    }
  } catch (error) {
    console.log('TERAPIST REGISTRATION ERROR!',error);
    res
      .status(500)
      .send({ name: error.name, info: error.message });
  }
}

module.exports = TerapistController;