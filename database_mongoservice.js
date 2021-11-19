const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const url = 'mongodb://localhost:27017'
const client = new MongoClient(url); 
const dbName = 'aisa'
const collectionName = 'aisaCollection'

client.connect(function(err) 
{
    assert.equal(null, err)

    console.log('Connected successfully to server')

    const db = client.db(dbName)

    //Touren Collection
    db.createCollection(collectionName, function(err, res)
    {
        if (err) throw err
        console.log("Collection created!")
    })

    const collection = db.collection(collectionName)

    //const data = [] --> Demodaten

})