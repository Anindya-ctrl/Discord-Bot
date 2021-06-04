const mongoose = require('mongoose');

async function connectToMongoDB(collectionName) {
    const MONGODB_URI = `mongodb+srv://${ process.env.MONGODB_USERNAME }:${ process.env.MONGODB_PASSWORD }@discord-bot.t2cgx.mongodb.net/${ collectionName }?authSource=admin&replicaSet=atlas-9nra3q-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true`;

    await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    return mongoose;
}

module.exports = connectToMongoDB;
