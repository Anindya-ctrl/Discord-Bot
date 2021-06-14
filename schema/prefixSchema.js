const mongoose = require('mongoose');

const reqField = {
    type: String,
    required: true,
};

const prefixSchema = mongoose.Schema({
    _id: reqField,
    prefix: reqField,
});

module.exports = mongoose.model('custom-prefixes', prefixSchema);
