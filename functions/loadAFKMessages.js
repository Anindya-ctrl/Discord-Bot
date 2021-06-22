const { AFKMessageCache } = require('../info/afk');
const connectToMongoDB = require('./connectToMongoDB');
const AFKSchema = require('../schema/AFKSchema');

async function loadAFKMessages() {
    await connectToMongoDB('info').then(async mongoose => {
        try {
            await AFKSchema.find({}).then(AFKDocs => {
                AFKDocs.forEach(AFKDoc => {
                    const { id, AFKMessage } = AFKDoc;
    
                    AFKMessageCache.set(id, AFKMessage);
                });
            });
        } finally {
            mongoose.connection.close();
        }
    });
}

module.exports = loadAFKMessages;
