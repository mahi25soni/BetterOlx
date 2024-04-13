const express = require("express")
const { addProduct } = require("../controllers/productController")
const router = express.Router()

router.post("/addProduct", addProduct)
router.get("/getProductById/:product_id")
router.delete("/deleteProduct")
module.exports = router