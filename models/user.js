var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({

    sexe : {
        type: String,
        required: true
    },
    nom: {
        type: String,
        required: true
    },
    prenom : {
        type: String,
        required: true
    },
    dateDeNaissance : {
        type: Date,
        required: true
    },
    situationFamilialle:{
        type: String,
        required: true
    },
    cin :{
        type: String,
        required: true
    },
    dateExperationCIN :{
        type: Date,
        required: true
    },
    telephoneMobile :{
        type: Number,
        required: true
    },
    telephoneSupp : {
        type: Number,
        required: false
    },
    telephoneDomicile :{
        type: Number,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true
    },
    ville :{
        type: String,
        required: true
    },
    codePostale : {
        type: Number,
        required: false
    },
    adresse :{
        type: String,
        required: true
    },
    password: {
        type: String,
        required: false
    },

});

UserSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);