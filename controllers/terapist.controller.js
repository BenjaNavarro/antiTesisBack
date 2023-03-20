const TerapistController = {};
const Terapist = require('../models/Terapist');
const _ = require('lodash');


//GET /api/terapists
TerapistController.GetTerapists = async(req,res) => {
  try{
    const terapists = await Terapist.find();
    if(!terapists){
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({ error: "Not found"});
    }else{
      return res 
        .status(200)
        .header({'x-auth-token':req.token})
        .json({terapists,status:200})
    }
  }catch(error){
    console.error({error});
    res
      .status(500)
      .header({'x-auth-token':req.token})
      .send({ name: error.name, info:error.message });
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

TerapistController.DeleteTerapist = async (req,res) => {
  try {
    const id = req.params.id;
    const terapist = await Terapist.findOneAndDelete({_id:id});
    if(terapist){
      return res
        .status(200)
        .header({'x-auth-token':req.token})
        .json({status:200,terapist,message:'terapist deleted!'});
    }else{
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({status:400,message:'terapist deleted failed!'});
    }
  } catch (error) {
    console.error({error});
    res
      .status(500)
      .header({'x-auth-token':req.token})
      .send({ name: error.name, info:error.message });
  }
}

TerapistController.PutTerapist = async (req,res) => {
  try {
    const RUT = req.body.RUT;
    const terapist = await Terapist.findOne({RUT:RUT});
    if(terapist){
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
        // console.log('TERAPIST REGISTRATION SUCCESFULL!');
        return res
          .status(200)
          .header({'x-auth-token':req.token})
          .json({message:"newPacient",terapist:createdTerapist,status:200});
      }
    }
  } catch (error) {
    console.error({error});
    res
      .status(500)
      .header({'x-auth-token':req.token})
      .send({ name: error.name, info:error.message });
  }
}

TerapistController.ChangeStateTerapist = async(req,res) => {
  try {
    const terapistID = req.params.id;
    const terapist = await Terapist.findOne({_id:terapistID});
    if(!terapist){
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({message:"Terapist not found!",status:400});
    }
    terapist.state = !terapist.state;
    result = await terapist.save();
    if(result){
      const message = terapist.state?"Terapist Activated":"Terapist Disabled";
      return res
        .status(200)
        .header({'x-auth-token':req.token})
        .json({message:message,terapist:terapist,status:200});
    }else{
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({message:"Terapist state couldn't be changed!",terapist:terapist,status:400});
    }
  } catch (error) {
    console.error({error});
    res
      .status(500)
      .header({'x-auth-token':req.token})
      .send({ name: error.name, info:error.message });
  }
}

TerapistController.ChangePassword = async(req,res) => {
  try {
    const terapistID = req.params.id;
    const {password,password_confirmation} = req.body;
    const user = await Terapist.findOne({_id:terapistID});
    if(!user){
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({message:"User not found"});
    }
    if(!password || !password_confirmation){
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({message:"Password not provided!"});
    }
    if(password !== password_confirmation){
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({message:"Password and password confirmation must be equal!"});
    }
    user.password = password;
    user.password_confirmation = password_confirmation;
    const result = await user.save();
    if(!result){
      return res
        .status(400)
        .header({'x-auth-token':req.token})
        .json({message:"Terapist password couldn't be changed!"});
    }else{
      return res
        .status(200)
        .header({'x-auth-token':req.token})
        .json({message:"Terapist password changed!",terapist:user});
    }
  } catch (error) {
    console.error({error});
    return res
      .status(500)
      .header({'x-auth-token':req.token})
      .send({ name: error.name, info: error.message });
  }
}

module.exports = TerapistController;