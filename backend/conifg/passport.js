const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userType = req.query.state || "patient";

        const { emails, displayName, photos, id } = profile;
        const email = emails?.[0]?.value;
        const photo = photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), null);
        }

        const Model = userType === "doctor" ? Doctor : Patient;
        let user = await Model.findOne({ email });

        if (!user) {
          user = await Model.create({
            googleId: id,
            email,
            name: displayName,
            profileImage: photo,
            isVerified: true,
          });
        } else {
          if (!user.googleId) {
            user.googleId = id;
            user.profileImage = photo;
            await user.save();
          }
        }

        return done(null, { user, type: userType });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
