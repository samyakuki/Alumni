const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    linkedinId: {
        type: String,
        required: false 
    },
    graduationYear: {
        type: Number,
        required: true
    },
    profilePic: {
        type: String, 
        default: 'default-profile-pic-url'
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);