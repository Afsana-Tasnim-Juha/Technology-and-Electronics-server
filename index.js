const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;



//middleware

app.use(cors());
app.use(express.json());
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



const uri = `mongodb+srv://${process.env.BRAND_USER}:${process.env.BRAND_PASS}@cluster0.vlqjil4.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);

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

        const productCollection = client.db("productDB").collection("collect");

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        //addProduct
        app.post('/product', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        })

        app.get('/product', async (req, res) => {
            const cursor = productCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })
        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const options = {

                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, type: 1 },
            };
            const result = await productCollection.findOne(query, options);

            res.send(result);
        })


        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const detailInfo = req.body;
            console.log(detailInfo);
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: detailInfo.name,
                    brandName: detailInfo.brandName,
                    photo: detailInfo.photo,
                    price: detailInfo.price,
                    shortDescription: detailInfo.shortDescription,
                }

            }
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Technology and Electronics server is running')
})

app.listen(port, () => {
    console.log(`Technology and Electronics server is running on port ${port}`)
})