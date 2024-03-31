const express = require("express")
const app = express();
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")

if(process.env.NODE_ENV !== 'production'){
    require("dotenv").config()
}


const Router = require('./routes/index')
const AuthRouter = require('./routes/authors')

app.set("view engine" , "ejs")
app.set("layout" , "layouts/layout")
app.set("views" , __dirname + '/views')
app.use(expressLayouts)
app.use(express.static("public"))
app.use(bodyParser.urlencoded({limit : '10mb' , extended: false}))

const mongoose = require("mongoose")
mongoose.connect(process.env.DATA_URL)
const db = mongoose.connection
db.on("error" , error => console.error(error))
db.once("open" , () => console.log("successfully Connect!"))

app.use("/" , Router)
app.use("/authors" , AuthRouter)

app.listen(process.env.PORT || 3000)