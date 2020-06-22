var express     = require('express');
var bodyParser  = require('body-parser');
var passport	= require('passport');
var mongoose    = require('mongoose');
var config      = require('./config/config');
var port        = process.env.PORT || 5000; 
var cors        = require('cors');
var passportMiddleware = require('./middleware/passport');
 
var app = express();
app.use(express.static('uploads'));
app.use(cors());
 
// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (res.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});
// Use the passport package in our application
app.use(passport.initialize());
passport.use(passportMiddleware);
 
// Demo Route (GET http://localhost:5000)
app.get('/', (req, res) => {
    res.send('Hello! The API is at ' + '/api');
});
 
var routes = require('./routes/routes');
app.use('/api', routes);
 
mongoose.connect(config.db, { useUnifiedTopology: true, useNewUrlParser: true , useCreateIndex: true});
 
const connection = mongoose.connection;
 
connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});
 
connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});
 
app.listen(port);
console.log('There will be dragons');