const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email : {type: String, unique: true, required: true},
    password: {type: String, required: true},
    username : {type: String, unique: true, required: true},
    title : String,
    bio : String,
    contact : {
        phone: String,
        email: String,
        website: String
    },
    socials: {
        twitter: String,
        linkedin: String,
        github: String,
    },
    avatarUrl: {
        type: String,
        default: function () {
            return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${this.name}`;
        }
    },
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
// This model defines the structure of a user document in MongoDB using Mongoose.