const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');
const userModel = require('../models/landlord');

//Google Authentication
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5050/auth/google/login"
  },
  async (accessToken, refreshToken, profile, cb) => {
 console.log("Profile: ",profile);
    try {
    let user = await userModel.findOne({email: profile.emails[0].value});
    if(!user){
        user = new userModel({
            email: profile.emails[0].value,
            fullName: profile.displayName,
            isVerified: profile.emails[0].isVerified,
            password:''

        });
        await user.save();
    }
    return cb(null,user);
  } catch (error) {
    return cb(error,null)
  }
  }
));

//Facebook Authentication
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:5050/auth/facebook/login",
    profileFields: ['id', 'displayName', 'emails']
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log("Profile: ", profile);
    try {
      const email = profile.emails && profile.emails[0] && profile.emails[0].value;
      let user = await userModel.findOne({ email });

      if (!user) {
        user = new userModel({
          email,
          fullName: profile.displayName,
          isVerified: true, // Facebook doesn't always provide this
          password: ''
        });
        await user.save();
      }

      return cb(null, user);
    } catch (error) {
      return cb(error, null);
    }
  }
));

passport.serializeUser((user,cb) => {
console.log('user serialized:',user);
cb(null,user.id)
})


passport.deserializeUser(async(id,cb)=>{
    try {
        const user = await userModel.findByPk(id);
        if(!user){
          return cb(new Error('User not found'),null)
        }
        cb(null,user)
    } catch (error) {
        cb(error,null)
    }
})
module.exports = passport   
