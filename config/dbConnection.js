const mongoose = require("mongoose")
require("dotenv").config();


const dbConnect = async() => {

    mongoose.connect(process.env.LOCAL_MONGO_URL)
    .then(() => {
        console.log("Connected to mongodb database")
    })
    .catch((error) => {
        console.log("Error is connecting to database")
        console.log(error.message)
        process.exit(1)
    })

}

module.exports = dbConnect