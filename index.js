const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
// import { DotenvConfigOptions } from 'dotenv';
const pacients = require('./routes/pacients');
const admins = require('./routes/admins');
const terapists = require('./routes/terapists');

const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8500;

const corsOptions = {
  exposedHeaders: 'x-auth-token'
}

app.use(cors(corsOptions));

app.use(morgan("dev"));
app.use(helmet());

app.use(express.json({limit: '50mb'}));
app.use(bodyParser.json({ limit: "200mb" }));
app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));

app.use('/api', pacients);
app.use('/api', admins);
app.use('/api',terapists);

app.get('/',(req,res)=>{
  res.send("It's Alive!");
});

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log('Server Connected to Database MongoDB'))
.catch((error)=>console.error({error}))

app.listen(PORT,()=>console.log('Server on Port: '+PORT));