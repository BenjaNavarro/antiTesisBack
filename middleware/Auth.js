const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Terapist = require('../models/Terapist');
const Pacient = require('../models/Pacient');

async function Auth(req,res,next){
  console.log({headers:req.headers});
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  if(!token){
    console.error('not token provided!');
    return res.status(401).json({error:'Access Denied, no token provided'});
  }else{
    try {
      const data = jwt.verify(token, process.env.JWT_KEY);
      console.log({data});
      if(data.type == 'admin'){
        console.log({token});
        const admin = await Admin.findOne({_id:data._id,'tokens.token':token});
        console.log({admin});
        req.type = 'admin';
        if(req.method != 'GET'){
          var newToken = await admin.ChangeAuthToken(token);
          console.log({newToken});
          req.user = admin;
          req.token = newToken;
          return next();
        }else{
          var newToken = token;
          req.user = admin;
          req.token = newToken;
          return next();
        }
      }else if(data.type == 'terapist'){
        console.log({token});
        const terapist = await Terapist.findOne({_id:data._id,'tokens.token':token});
        console.log({terapist});
        req.type = 'terpist';
        if(req.method != 'GET'){
          var newToken = await terapist.ChangeAuthToken(token);
          console.log({newToken});
          req.user = terapist;
          req.token = newToken;
          return next();
        }else{
          var newToken = token;
          req.user = terapist;
          req.token = newToken;
          return next();
        }
      }else if(data.type == 'pacient'){
        console.log({token});
        const pacient = await Pacient.findOne({_id:data._id,'tokens.token':token});
        console.log({pacient});
        req.type = 'pacient';
        if(req.method != 'GET'){
          var newToken = await pacient.ChangeAuthToken(token);
          console.log({newToken});
          req.user = pacient;
          req.token = newToken;
          return next();
        }else{
          var newToken = token;
          req.user = pacient;
          req.token = newToken;
          return next();
        }
      }else{
        throw new Error({message:'Not a valid user type, access denied',name:'invalid user'})
      }
      // console.log({type:req.type});
      // console.log({method:req.method});
      // const newToken = req.method != 'GET' ? await user.ChangeAuthToken(token):token;
      // console.log({newToken:newToken});
      // req.user = user;
      // req.token = newToken;
      // next();
    } catch (error) {
      res.status(401).json({ error: "Not authorized to access this resource" });
    }
  }
}

module.exports = Auth;