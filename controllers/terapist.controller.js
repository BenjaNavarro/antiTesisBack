const TerapistController = {};
const Terapist = require('../models/Terapist');
const _ = require('lodash');


//GET /api/terapists
TerapistController.GetTerapists = async(req,res) => {
  try{
    const terapists = await Terapist.find();
    if(!terapists){
      return res
        .status(404)
        .send({ error: "Not found"});
    }else{
      return res 
        .status(200)
        .send(terapists)
    }
  }catch(error){
    res
      .status(500)
      .send({ name: error.name, info:error.message })
  }
}



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

TerapistController.Login = async(req,res) => {
  try {
    const { rut, password } = req.body;
    const terapist = await Terapist.findByCredentials(rut,password);
    if(terapist){
      const token = await terapist.generateAuthToken();
      return res
        .status(200)
        .header({'x-auth-token':token,status:200})
        .json({status:200,terapist});
    }else{
      console.log('TERAPIST NOT FOUND!');
      return res
      .status(400)
      .json({status:400,message:'Terapist not found!'});
    }
  } catch (error) {
    console.log('TERAPIST LOGIN ERROR!',error);
    res
      .status(500)
      .send({ name: error.name, info: error.message });
  }
}

TerapistController.Logout = async (req,res) => {
  try {
    const terapist = await req.user.Logout(req.token);
    if(terapist){
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

module.exports = TerapistController;