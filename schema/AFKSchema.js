const mongoose = require('mongoose');

const reqField = {
    type: String,
    required: true,
};

const AFKSchema = mongoose.Schema({
    _id: reqField,
    AFKMessage: reqField,
});

module.exports = mongoose.model('afk-messages', AFKSchema);
