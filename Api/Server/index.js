import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import multer from 'multer';
import Config from 'dotenv';
import { Server } from 'socket.io'
import http from 'http';
import CarPart from './Models/CarPart.js';
Config.config();

const app = express();

// Socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
  }
});

io.on('connection', (socket) => {
  console.log('A user connected ', socket.id);

  socket.on('check-notifcations', async () => {
    const notifications = await Notification.find({ isRead: false })
    socket.emit('check-notifcations', notifications)
  })
  
  socket.on('might-need-notifcation', async ({id}) => {
    const carPart = await CarPart.findById(id);
    if(carPart && carPart.stock_quantity <= 5){
      const notification = new Notification({
        title: 'Informe',
        message: `The stock quantity of ${carPart.name} is ${carPart.stock_quantity}`
      })
      await notification.save();
      io.emit('notifcation', notification)
    } else if (carPart && carPart.stock_quantity == 0 ){
      const notification = new Notification({
        title: 'Warning',
        message: `${carPart.name} is out of stock`
      })
      await notification.save();
      io.emit('notification', notification)
    }
  })
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});
// Connecting to the database
mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Handling static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Handling midlwares
app.use(express.json()) // parsing all the comming requests's body from json.npm run dev
const options = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: '*'
}
app.use(Cors(options))

// assets
app.use('/assets', express.static(path.join(__dirname, './../Public/')));
app.use('/assets', express.static(path.join(__dirname, './../dist/assets')));

// Logging the requests
app.use((req, res, next) => {
  console.log(
    "Coming : [ " +
      req.method +
      " Request ] " +
      res.statusCode +
      " " +
      req.url +
      " [ " +
      new Date().toDateString() +
      " ]"
  );
  next();
});


// Importing the routes
import UsersRouter from './Routes/Users/index.js'
import authRouter from './Routes/Auth/index.js'
import carParts from './Routes/CarParts/index.js'
import Notifications from './Routes/Notifications/index.js'
import { initAdmin, response } from './utils.js';

// Using the routes
app.use(initAdmin)
app.use('/api/auth', authRouter)
app.use('/api/users', UsersRouter)
app.use('/api/car-parts', carParts)
app.use('/api/notifications', Notifications)

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    res.status(400).json(JSON.parse(err.message));
  }
});

app.get('/', (req, res)=>{
  res.sendFile(path.join(__dirname, './../dist/index.html'))
})
app.use('/*', (req, res)=>{
  res.sendFile(path.join(__dirname, './../dist/index.html'))
})

export default server;
export { io }