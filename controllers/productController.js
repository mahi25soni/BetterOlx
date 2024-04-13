const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");


const addProduct = async (req, res) => {
    try {
        const new_product = await Product.create(req.body);

        await User.findByIdAndUpdate({_id : req.body.seller}, {$push : {asSeller : new_product._id}} , {new : true})

        res.status(201).json({
            message : "New product added!",
            data : new_product
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}


const getProductById = async (req, res) => {
    try {

    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}


const deleteProduct = async (req, res) => {
    try {

    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}


module.exports = {
    addProduct
}