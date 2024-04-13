const mongoose = require("mongoose")
require("dotenv").config()

const userSchema = new mongoose.Schema({
    username : {
        type : String
    },
    email : {
        type : String,
        unique : true,
        required : true
    },
    phone_number : {
        type : String,
        unique : true,
        required : true
    },
    role : {
        type : String,
        enum : ["CUSTOMER","ADMIN"],
        required : true,
        default : "CUSTOMER"
    },
    password : {
        type : String,
        required : true
    },
    otp : {
        type : Number,
        required : true
    },
    active : {
        type : Boolean,
        default : false
    },
    asSeller : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        }
    ],
    asBuyer : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Product"
        }
    ],
    // addresses : [
    //     {
    //         type : mongoose.Schema.Types.ObjectId,
    //         ref : "Address"
    //     }
    // ]

},
{
    timestamps : true
})


const User = new mongoose.model("User", userSchema)



module.exports = {
    User
    
}
