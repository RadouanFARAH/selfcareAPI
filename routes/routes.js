var express         = require('express'),
    routes          = express.Router();
var userController  = require('../controller/user-controller');
var passport	    = require('passport');
 
routes.get('/',passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.send('Hello, this is the API!');
});
 
routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);
 
routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `Email: ${req.user.email}! (from server)` });
});
 
module.exports = routes;