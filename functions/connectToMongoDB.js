const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://MaNameAJeff:jeff@discord-bot.t2cgx.mongodb.net/moderation?authSource=admin&replicaSet=atlas-9nra3q-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';

async function connectToMongoDB() {
    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return mongoose;
}

module.exports = connectToMongoDB;
