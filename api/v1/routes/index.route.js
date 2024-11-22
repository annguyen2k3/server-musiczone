const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

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
            callbackURL: "https://server-musiczone.vercel.app/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
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
        (req, res) => {
            res.redirect(version + "/account/auth/google");
        }
    );
    //End Login with Google
};
