const express = require("express")
const bodyParser = require("body-parser")
require("dotenv").config();

const dbConnect = require("./config/dbConnection")

const PORT = process.env.PORT || 4000 

const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))



dbConnect();

app.listen(PORT, () => {
    console.log("Server started!")
})