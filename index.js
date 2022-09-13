const express = require('express')();
const PORT = 8000;
const app = express();

app.use(express.json());

app.listen(
  PORT,()=>{console.log('Server on Port '+PORT)}
);

app.get('/',(req,res)=>{
  return res.json('It is Alive!').status(200)
});