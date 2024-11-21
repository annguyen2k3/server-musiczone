const songRoutes = require("./song.route");
const accountRoutes = require("./account.route");

module.exports = (app) => {
    const version = "/api/v1";

    app.get("/", (req, res) => {
        res.send("<a href='/auth/google'>Login with Google</a>");
    });

    app.use(version + "/songs", songRoutes);

    app.use(version + "/account", accountRoutes);
};
