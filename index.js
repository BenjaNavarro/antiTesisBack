const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server,{
  cors: {
    origin:'*',
    methods: ['GET','POST','PUT','DELETE','OPTIONS','HEAD']
  }
});

app.use(cors());

const PORT = 8000;

app.get('/',(req,res)=>{
  res.send('It is alive!');
});

io.on('connection',(socket)=>{
  socket.emit('me',socket.id);

  socket.on('disconnect',()=>{
    socket.broadcast.emit('callended');
  });

  socket.on('calluser',({userToCall,signalData,from,name})=>{
    io.to(userToCall).emit('callUser',{signal:signalData,from,name});
  });

  socket.on('answercall',(data)=>{
    io.to(data.to).emit('callaccepted',data.signal);
  });
})

server.listen(PORT,()=> console.log('Server on port: ',PORT));