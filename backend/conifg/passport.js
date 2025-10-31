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
      passReqToCallback: true, // allows us to access req.query.state
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        // get user type from query string (state)
        const userType = req.query.state || "patient";

        const email = profile.emails?.[0]?.value;
        const name = profile.displayName || "Unnamed User";
        const photo = profile.photos?.[0]?.value || "";
        const googleId = profile.id;

        // safety check: ensure email exists
        if (!email) {
          return done(new Error("Google account does not provide an email"), null);
        }

        // choose model based on userType
        const Model = userType === "doctor" ? Doctor : Patient;

        // find user by email
        let user = await Model.findOne({ email });

        // if user does not exist, create one
        if (!user) {
          user = await Model.create({
            googleId,
            email,
            name,
            profileImage: photo,
            isVerified: true,
          });
        } else {
          // if user exists but doesn't have googleId saved, update it
          if (!user.googleId) {
            user.googleId = googleId;
            user.profileImage = photo;
            await user.save();
          }
        }

        // pass user and type to next step
        return done(null, { user, type: userType });
      } catch (error) {
        console.error("Error during Google OAuth:", error);
        return done(error, null);
      }
    }
  )
);

// export passport
module.exports = passport;
