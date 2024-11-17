const songRoutes = require('./song.route')

module.exports = (app) => {

    const version = "/api/v1";

    app.use(version + "/songs", songRoutes);

}