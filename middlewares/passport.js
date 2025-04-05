const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const tenantModel = require('../models/tenant');

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:5050/auth/google/login"
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log("Profile: ", profile);
    try {
      let tenant = await tenantModel.findOne({ where: { email: profile.emails[0].value } }); // Fixed query
      if (!tenant) {
        tenant = new tenantModel({
          email: profile.emails[0].value,
          fullName: profile.displayName,
          isVerified: profile.emails[0].verified || false, // Ensure `isVerified` is properly handled
          password: '' // Empty password for OAuth users
        });
        await tenant.save(); // Fixed typo from `uder.save()` to `tenant.save()`
      }
      return cb(null, tenant);
    } catch (error) {
      return cb(error, null);
    }
  }
));

passport.serializeUser((tenant, cb) => { // Fixed method name
  console.log('Tenant serialized:', tenant);
  cb(null, tenant.id);
});

passport.deserializeUser(async (id, cb) => { // Fixed method name
  try {
    const tenant = await tenantModel.findByPk(id);
    if (!tenant) {
      return cb(new Error('Tenant not found'), null);
    }
    cb(null, tenant);
  } catch (error) {
    cb(error, null);
  }
});

module.exports = passport;