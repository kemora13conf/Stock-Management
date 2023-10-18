import express from 'express';
import mongoose from 'mongoose';
import Cors from 'cors';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import multer from 'multer';
import Config from 'dotenv';
Config.config();

const app = express();

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
import { initAdmin, response } from './utils.js';

// Using the routes
app.use(initAdmin)
app.use('/api/auth', authRouter)
app.use('/api/users', UsersRouter)
app.use('/api/car-parts', carParts)

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading
    res.status(400).json(JSON.parse(err.message));
  }
});

app.use('/*', (req, res)=>{
    res.json(response('not_found', 'This endpoint does not exist'))
})

export default app