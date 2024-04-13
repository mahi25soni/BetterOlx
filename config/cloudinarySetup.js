const cloudinary = require('cloudinary').v2
require("dotenv").config()

const cloudConnect = () => {
    try{

        cloudinary.config({
            cloud_name : process.env.CLOUDNAME,
            api_key : process.env.CLOUD_API_KEY,
            api_secret : process.env.CLOUD_API_KEY,
        })
    }
    catch(error) {
        console.log(error.message) 
        
    }
}

module.exports = cloudConnect