const songRoutes = require('./song.route')

module.exports = (app) => {

    const version = "/api/v1";

    app.get("/", (req, res) => {
        res.send("OK");
    })

    app.use(version + "/songs", songRoutes);

}