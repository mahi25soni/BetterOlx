const express = require("express")
const bodyParser = require("body-parser")
const cookieParse = require("cookie-parser")
require("dotenv").config();

const dbConnect = require("./config/dbConnection")
const userRoute = require("./routes/userRoute")
const productRoute = require("./routes/productRoute")

const PORT = process.env.PORT || 3000 

const app = express();
app.use(cookieParse())
app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use("/api/user",userRoute)
app.use("/api/product", productRoute)



dbConnect();

app.listen(PORT, () => {
    console.log("Server started!")
})