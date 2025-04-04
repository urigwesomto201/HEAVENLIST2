const express = require('express')
const sequelize = require('./database/sequelize')
require('dotenv').config()
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
require('./middlewares/passport');


const PORT = process.env.PORT 
const secret = process.env.EXPRESS_SECRET; // Ensure this is defined in .env
const transacRouter = require('./routes/transactionRouter')
const userRouter = require('./routes/userRouter')
const tenantRouter = require('./routes/tenantRouter')
const landlordRouter = require('./routes/landlordRouter')
const adminRouter = require('./routes/adminRouter')
const listingRouter = require('./routes/listingRouter')
const landlordProfileRouter = require('./routes/landlordProfileRoute')
const swaggerJSDOC = require('swagger-jsdoc');
const swaggerUIEXPRESS = require('swagger-ui-express');

const app = express()

app.use(cors())
app.use(express.json())

app.use(express.json());

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());
// Swagger Definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'HavenList Documentation',
    version: '1.0.0',
    description: 'This is a swagger documentation for our web application HavenList (Group 7).',
    license: {
      name: 
      'Base_URL: https://heavenlist2.onrender.com ',
    },
    contact: {
      names: 'urigwe somto $ Ebuka ',
      url: 'https://github.com/urigwesomto201/HEAVENLIST2',
    },
  },
  "components": {
 "securitySchemes": {
    "BearerAuth": {
      "type": 'http',
      "scheme": 'bearer',
      "bearerFormat": 'JWT',
    },
  },
},
security: [
  {
    bearerAuth: [],
  },
],
  servers: [
    {
      url: 'https://heavenlist2.onrender.com',
      description: 'Production server',
    },
    {
      url: 'http://localhost:5050',
      description: 'Development server',
    },
  ],


};


// Swagger Options
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Adjust this path based on your actual route files
};

const swaggerSpec = swaggerJSDOC(options);

// Swagger UI setup
app.use('/havenList', swaggerUIEXPRESS.serve, swaggerUIEXPRESS.setup(swaggerSpec));

app.use('/api/v1/',userRouter)
app.use('/api/v1/',tenantRouter)
app.use('/api/v1/',landlordRouter)
app.use('/api/v1/',adminRouter)
app.use('/api/v1/',listingRouter)
 app.use('/api/v1/',landlordProfileRouter)
app.use('/api/v1/',transacRouter)
app.use((error, req, res, next) => {
  if(error){
     return res.status(400).json({message:  error.message})
  }
  next()
})

const server = async () => {
  try {
      await sequelize.authenticate();
      console.log('Connection to database has been established successfully.');
  } catch (error) {
      console.error('Unable to connect to the database:', error.message);
  }
};

server();








const database = async () => {
try {
    await sequelize.authenticate()
      console.log('Connection to database has been established successfully')
} catch (error) {
    console.log('unable to connect to the database', error )
        
    }
}

database()
app.listen(PORT, () => {
    console.log(`my server is running on port ${PORT}`)
})