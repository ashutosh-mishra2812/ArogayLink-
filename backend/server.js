const express = require('express')
const mongoose=require('mongoose')
const helmet =require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
require('dotenv').config();





const app=express();

// Helmet => acts like a safety gear 🪖
// It secures the app by adding extra protection to HTTP headers. 

app.use(helmet());

// Logging ke liye morgan
// Morgan ek CCTV camera ki tarah hai jo har request ka record rakh leta hai.
app.use(morgan("dev"));
app.use(cors({
        origin:(process.env.ALLOWED_ORIGINS || '').split(',').map(s=> s.trim()).filter(Boolean)|| '*',
        credentials:true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get('/health', (req,res)=>res.ok({time:new Date().toISOString()},'OK'))


const PORT = process.env.PORT ||5000

app.listen(PORT,()=> console.log(`Server is Connected on ${PORT}`));