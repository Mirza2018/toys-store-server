const express = require('express');
const cors = require('cors');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Server is on the way")
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4fvtstz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const toysCollection = client.db('toysDB').collection('toys')
        const toysBuyCollection = client.db('toysDB').collection('toysBuy')


        app.get('/toys', async (req, res) => {
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toysCollection.find(query).toArray()
            res.send(result)
        })


        app.post('/toys', async (req, res) => {
            const toy = req.body;
            const result = await toysCollection.insertOne(toy)
            res.send(result)

        })


        app.put('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const toy = req.body;
            console.log(toy, "obhrfjii");
            const objects = {
                $set: {
                    name: toy.name,
                    category: toy.category,
                    price: toy.price,
                    rating: toy.rating,
                    quantity: toy.quantity,
                    img: toy.img,
                    details: toy.details,
                    email: toy.email,
                    seller: toy.seller,
                }
            }
            console.log(objects, "obhrfjii");
            const options = { upsert: true }
            const result = await toysCollection.updateOne(filter, objects, options)
            res.send(result)

        })


        app.get('/toys/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(filter)

            res.send(result)

        })
        app.delete('/toys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(filter)

            res.send(result)

        })





        app.post('/buy', async (req, res) => {
            const toy = req.body;
            console.log(toy);
            const result = await toysBuyCollection.insertOne(toy)
            res.send(result)

        })



        app.get('/mytoys', async (req, res) => {
            const result = await toysBuyCollection.find().toArray()
            res.send(result)
        })

        
        app.delete('/mytoys/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const result = await toysBuyCollection.deleteOne(filter)

            res.send(result)

        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("port no is", port);
})

