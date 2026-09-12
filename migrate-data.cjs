require('dotenv').config();
const { MongoClient } = require('mongodb');

async function migrate() {
    const localUri = 'mongodb://127.0.0.1:27017/anti-tarnish';
    const remoteUri = process.env.MONGODB_URI;

    if (!remoteUri) {
        console.error('No MONGODB_URI found in .env');
        process.exit(1);
    }

    console.log(`Connecting to local DB: ${localUri}`);
    const localClient = new MongoClient(localUri);
    
    try {
        await localClient.connect();
    } catch (e) {
        console.error("Could not connect to local DB, perhaps it's empty or not running.", e);
        process.exit(1);
    }
    const localDb = localClient.db();

    console.log(`Connecting to remote DB...`);
    const remoteClient = new MongoClient(remoteUri);
    try {
        await remoteClient.connect();
    } catch (e) {
        console.error("Could not connect to remote DB", e);
        await localClient.close();
        process.exit(1);
    }
    const remoteDb = remoteClient.db();

    const collections = await localDb.listCollections().toArray();
    if (collections.length === 0) {
        console.log("No collections found in the local database to migrate.");
    }

    for (const collectionInfo of collections) {
        const collectionName = collectionInfo.name;
        console.log(`\nProcessing collection: ${collectionName}`);
        
        const localCollection = localDb.collection(collectionName);
        const remoteCollection = remoteDb.collection(collectionName);
        
        const docs = await localCollection.find({}).toArray();
        console.log(`Found ${docs.length} documents in local DB.`);

        if (docs.length > 0) {
            try {
                // To avoid duplicate key errors, we can use insertMany with ordered: false
                await remoteCollection.insertMany(docs, { ordered: false });
                console.log(`Successfully migrated documents to ${collectionName}.`);
            } catch (err) {
                // If ordered is false, we might get a BulkWriteError if some documents already exist.
                if (err.code === 11000) {
                    console.log(`Some documents already exist in ${collectionName} (duplicate key), skipped those.`);
                } else {
                    console.error(`Error inserting into ${collectionName}:`, err.message);
                }
            }
        }
    }

    await localClient.close();
    await remoteClient.close();
    console.log('\nMigration completed.');
}

migrate().catch(console.error);
