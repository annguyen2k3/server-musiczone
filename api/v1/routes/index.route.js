const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

const Account = require("../models/account.model");
const User = require("../models/user.model");
const generateHelpers = require("../../../helpers/generate");

const songRoutes = require("./song.route");
const accountRoutes = require("./account.route");
const playlistRoutes = require("./playlist.route");
const userRoutes = require("./user.route");

//Passport
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL_GG,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;
                const userName = profile.displayName;
                const avatar = profile.photos[0].value;

                const account = await Account.findOne({
                    email: email,
                    type: "google",
                    deleted: false,
                });

                let token;
                let user;
                if (account) {
                    token = account.token;
                } else {
                    // Tạo tài khoản mới nếu chưa tồn tại
                    const newAcc = new Account({
                        email: email,
                        type: "google",
                        token: generateHelpers.generateRandomString(30),
                    });

                    user = new User({
                        userName: userName,
                        email: email,
                        avatar: avatar,
                        token: newAcc.token,
                    });

                    await newAcc.save();
                    await user.save();
                    token = newAcc.token;
                }

                return done(null, { token });
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));
//End Passport

module.exports = (app) => {
    const version = "/api/v1";

    app.get("/", (req, res) => {
        res.send("<a href='/auth/google'>Login with Google</a>");
    });

    app.use(version + "/songs", songRoutes);

    app.use(version + "/account", accountRoutes);

    app.use(version + "/playlist", playlistRoutes);

    app.use(version + "/user", userRoutes);

    //Login with Google

    app.get(
        "/auth/google",
        passport.authenticate("google", { scope: ["profile", "email"] })
    );

    app.get(
        "/auth/google/callback",
        passport.authenticate("google", { failureRedirect: "/" }),
        async (req, res) => {
            const token = req.user.token;

            res.redirect(`http://127.0.0.1:5500/?token=${token}`);
        }
    );
    //End Login with Google
};
