const express = require("express")
const router = express.Router()
const { addProduct, deleteProduct, getProductById } = require("../controllers/productController")

const multer = require("multer")
const upload = multer({dest : 'uploads/'})


router.post("/addProduct", upload.array("pics",4), addProduct) // max one pic, minimum ek, frontend se validation laga denge
router.get("/getProductById/:product_id", getProductById)
router.delete("/deleteProduct/:product_id", deleteProduct)
module.exports = router