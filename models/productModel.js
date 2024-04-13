const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    seller : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    name : {
        type : String,
    },
    price : {
        type : Number
    },
    description : {
        type : String
    },
    isAvailable : {
        type : Boolean,
        default : true
    },
    images_url : [
        {
            type : String
        }
    ],
    // See, ek image ki public id se images ke folder ka pta lag jayega, and then ham folder ke andar ka sab delete kar sakte hai
    images_public_id : [{
        type : String
    }],
    address : {
        type : String
    },

    category : {
        type : String
    },
    sub_category : {
        type : String
    },
    product_details : 
        {
            type : Object
        }
    
},
{
    timestamps : true
})

const Product = new mongoose.model("Product", productSchema)

module.exports  = {
    Product
}