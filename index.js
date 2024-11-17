const express = require('express')
require("dotenv").config()

const app = express()
const port = process.env.PORT

//Database
const database = require('./config/database')
database.connect();

//Cors
const cors = require('cors')
app.use(cors());

//Routes
const routesApiVer1 = require('./api/v1/routes/index.route')
routesApiVer1(app)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})