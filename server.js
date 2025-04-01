const express = require('express')
const sequelize = require('./database/sequelize')
require('dotenv').config()
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
require('./middlewares/passport');


const PORT = process.env.PORT || 5050
const secret = process.env.EXPRESS_SECRET; // Ensure this is defined in .env
const transacRouter = require('./routes/transactionRouter')
const userRouter = require('./routes/userRouter')
const tenantRouter = require('./routes/tenantRouter')
const landlordRouter = require('./routes/landlordRouter')
const adminRouter = require('./routes/adminRouter')
const listingRouter = require('./routes/listingRouter')


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

app.use('/api/v1',userRouter)
app.use('/api/v1',tenantRouter)
app.use('/api/v1',landlordRouter)
app.use('/api/v1',adminRouter)
app.use('/api/v1',listingRouter)
app.use(transacRouter)
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




const swaggerJsdoc = require("swagger-jsdoc");
const swagger_UI = require("swagger-ui-express")



const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'my api',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
           bearerFormat: "JWT"
        }
      }
    }, 
    security: [{ BearerAuth: [] }]
  },
  apis: ["./routes/*.js"] // Ensure this points to the correct path
};

const openapiSpecification = swaggerJsdoc(options);
app.use("/documentation", swagger_UI.serve, swagger_UI.setup(openapiSpecification))



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