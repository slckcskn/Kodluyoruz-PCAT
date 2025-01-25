const express = require("express")
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override')
require('dotenv').config()
const ejs = require("ejs")
const photoController = require("./controllers/photoControllers");
const pageController = require('./controllers/pageController')

const app = express()

// main().then(()=>{console.log('DB CONNECTED')})
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(`mongodb+srv://${process.env.MONGODB_ID}:${process.env.MONGODB_PW}@cluster0.adbk0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
  .then(()=>{console.log("DB Connected")}).catch((err)=>{console.log(err)});
}
//TEMPLATE ENGINE
app.set("view engine", "ejs")

// const myLogger = (req,res,next) => {
//   console.log("Middleware Log 1")
//   next()
// }
// const myLogger2 = (req,res,next) => {
//   console.log("Middleware Log 2")
//   next()
// }

//MIDDLEWARES
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(fileUpload());
app.use(methodOverride('_method', {
  methods:['POST', 'GET']
}))
// app.use(myLogger)
// app.use(myLogger2)

//ROUTES
app.get('/', photoController.getAllPhotos)
app.post('/photos', photoController.createPhoto)
app.get('/photos/:id', photoController.getPhoto)
app.put('/photos/:id', photoController.updatePhoto)
app.delete('/photos/:id', photoController.deletePhoto)
app.get('/about', pageController.getAboutPage)
app.get('/add', pageController.getAddPage)
app.get('/photos/edit/:id', pageController.getEditPage)


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalıştı.`)
})