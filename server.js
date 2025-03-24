const express= require('express');
require('./config/database');
const PORT = 5527
const cors = require('cors')
const weatherrouter =require('./routes/weather')
const app = express()
app.use(express.json());
app.use(weatherrouter);
app.use(cors())
app.listen(PORT,()=>{
  console.log(`server listenimg to ${PORT}`);
  
})