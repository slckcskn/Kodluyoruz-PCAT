const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
    title: String,
    description: String,
    image: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

const Photo = mongoose.model('Photo', photoSchema)

module.exports = Photo