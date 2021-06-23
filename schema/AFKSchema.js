const mongoose = require('mongoose');

const reqStringField = {
    type: String,
    required: true,
};

const AFKSchema = mongoose.Schema({
    _id: reqStringField,
    AFKMessage: reqStringField,
    at: {
        type: Date,
        required: true,
    }
});

module.exports = mongoose.model('afk-messages', AFKSchema);
