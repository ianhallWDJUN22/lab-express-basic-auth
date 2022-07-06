const session = require("express-session");
const MongoStore = require("connext-mongo");
const mongoose = require('mongoose');

module.exports = (app) => {

app.use(
    session({
        secret: process.env.SESS_SECRET
    })
)

}