const mongoose = require('mongoose');

const reqField = {
    type: String,
    required: true,
}

const welcomeSchema = mongoose.Schema({
    _id: reqField,
    channelId: reqField,
    welcomeMessage: reqField,
});

module.exports = mongoose.model('welcome-messages', welcomeSchema);
