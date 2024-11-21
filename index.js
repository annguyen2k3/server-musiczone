const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const database = require("./config/database");
const routesApiVer1 = require("./api/v1/routes/index.route");

const app = express();
const port = process.env.PORT;

//Database
database.connect();

//Cors
app.use(cors());

// parse application/json
app.use(bodyParser.json());

//Session
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

//Cookie Parser
app.use(cookieParser());

//Routes
routesApiVer1(app);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
