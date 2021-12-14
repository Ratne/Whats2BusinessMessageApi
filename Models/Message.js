const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    message: {
        type: String,
        trim: true,
        required: true
    },
    phone: {
        type: String,
        trim: true,
        required: true,
    },
    name: {
        type: String,
        trim: true
    },
    surname: {
        type: String,
        trim: true
    },

},{
    timestamps: true,
});



module.exports = mongoose.model('Message', messageSchema);