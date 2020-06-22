var express         = require('express'),
    routes          = express.Router();
var userController  = require('../controller/user-controller');
var passport	    = require('passport');
var User = require('../models/user');
var multer      = require('multer');
var path = require('path');
var fs = require('fs');
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
        cb(null,file.originalname);
    }
})
var upload = multer({storage: storage});
 
routes.get('/',passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.send('Hello, this is the API!');
});
 
routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);
 
routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `Email: ${req.user.email}! (from server)` });
});

routes.put('/special', passport.authenticate('jwt', { session: false }),upload.single('profileImage') , (req, res) => {
    const image = {
        originalname: req.file.originalname,
        path: req.file.path
    };
    console.log(req.file)
    User.update({email:req.user.email}, {$set:{profileImage: image}}).then((result)=>{
        res.setHeader('Content-Type', 'image/jpeg');
        fs.createReadStream(path.join('uploads', req.file.filename)).pipe(res);
    }).catch((err)=>{
        res.status(400).send(err);
    });
});


 
module.exports = routes;