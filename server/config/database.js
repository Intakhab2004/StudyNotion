const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log("Connection with the database is done successfully")
    })
    .catch((error) => {
        console.log("Something went wrong in connsection")
        console.error(error)
        process.exit(1);
    })
}

module.exports = dbConnect;