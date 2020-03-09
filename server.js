//production env check, if we are not running on a dedicated server, we will load from .env file.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
//importing filepond

// We need express, express-ejs-layouts,bodyparser, methodOverride(for put and delete request) and mongoose
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const FilePond=require('filepond')
var methodOverride = require('method-override')
//Creating instance of express class.
const app = express();

//const getting router
const indexRouter = require('./routes/index')
//getting author router
const authorRouter = require('./routes/authors')
//getting book router
const bookRouter = require('./routes/books')

//setting up view engine as ejs
app.set('view engine', 'ejs')

//setting up views folder that is , this directory + views folder
app.set('views', __dirname + '/views')

//this is layout folder where all our header and footer is assigned.
app.set('layout', 'layouts/layout')


//Body Parser must be used first, before any routing applications using body parser in order to access valus easily.
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
//using method override library for updations and deletions
app.use(methodOverride('_method'))
//using express layouts.
app.use(expressLayouts);

//public is the folder where all our images and style sheets will be there. 
app.use(express.static('public'));

//using router
app.use('/', indexRouter)

//using author router
app.use('/authors', authorRouter)

//using book  router
app.use('/books', bookRouter)


//setting up mongoDB    
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

//any error happens, to be displayed
db.on('error', error => console.error(error))
//successful connection
db.once('open', () => console.log('Connected to Mongoose'))


//listening to port 5000
app.listen(process.env.PORT || 5000);