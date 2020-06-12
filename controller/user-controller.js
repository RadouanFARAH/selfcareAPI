var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
        expiresIn: 200 // 86400 expires in 24 hours
    });
}

exports.registerUser = (req, res) => {
    if (!req.body.email 
        || !req.body.sexe 
        || !req.body.nom 
        || !req.body.prenom 
        || !req.body.dateDeNaissance 
        || !req.body.situationFamilialle 
        || !req.body.cin 
        || !req.body.dateExperationCIN 
        || !req.body.telephoneMobile 
        || !req.body.ville 
        || !req.body.adresse) {
        return res.status(400).json({ 'msg': 'You need to send all the required informations' });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).json({ 'msg': err });
        }

        if (user) {
            return res.status(400).json({ 'msg': 'The user already exists' });
        }

        let newUser = User(req.body);
        newUser.save((err, user) => {
            if (err) {
                return res.status(400).json({ 'msg': err });
            }
            return res.status(201).json(user);
        });
    });
};

exports.loginUser = (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).send({ 'msg': 'Il faut envoyer tout les infos' });
    }

    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) {
            return res.status(400).send({ 'msg': err });
        }

        if (!user) {
            return res.status(400).json({ 'msg': 'les donnees sont incorrects' });
        }

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (isMatch && !err) {
                return res.status(200).json({
                    token: createToken(user)
                });
            } else {
                return res.status(400).json({ msg: 'les donnees sont incorrects' });
            }
        });
    });
};