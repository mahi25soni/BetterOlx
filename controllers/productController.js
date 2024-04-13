const { Product } = require("../models/productModel");
const { User } = require("../models/userModel");
const cloudinary = require('cloudinary').v2


async function uploadOnMyCloud (filepath) {
    const options = {
        folder : "BetterOlx",
        resource_type : "image",
    }
    return await cloudinary.uploader.upload(filepath, options);
}


const addProduct = async (req, res) => {
    try {

        const all_image = req.files
        let images_url = [];
        let images_public_id = [];

        const uploader = all_image.map(async (file) => {
            const link = await uploadOnMyCloud(file.path);
            images_url.push(link.secure_url)
            images_public_id.push(link.public_id)

            return link;
        })

        await Promise.all(uploader)

        const new_product = await Product.create({
            images_url,
            images_public_id,
            ...req.body
        })


        await User.findByIdAndUpdate({_id : req.body.seller}, {$push : {asSeller : new_product._id}}, {new : true})

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
        const product_id = req.params.product_id

        const the_product = await Product.findOne({_id : product_id})

        console.log(the_product)
        res.status(200).json({
            message : "Your product data!",
            data : the_product
        })
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
        const product_id = req.params.product_id

        const the_product = await Product.findOneAndDelete({_id : product_id})

        the_product.images_public_id.map(async (public_id) => {
            await cloudinary.uploader.destroy(public_id)
            // console.log(public_id)
        })


        await User.findByIdAndUpdate({_id : the_product.seller}, {$pull : {asSeller : the_product._id}}, {new : true})



        res.status(200).json({
            message : "Product deleted successfully!"
        })
    }
    catch(error) {
        console.log(error.message)
        return res.status(500).json({
            message : "Internal Server Error!"
        })
    }
}


module.exports = {
    addProduct,
    deleteProduct,
    getProductById
}