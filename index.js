const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;




//middle were
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bfaqolh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


        const servicesCollection = client.db('carsDoctor').collection('services');
        const bookingsCollection = client.db('carsDoctor').collection('bookings');

        app.get('/serivices', async (req, res) => {
            const cursor = servicesCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })


        app.get('/serivices/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: new ObjectId(id) };

            const options = {
                // Include only the `title` and `imdb` fields in the returned document
                projection: { title: 1, price: 1, service_id: 1, img: 1 },
            };

            const result = await servicesCollection.findOne(qurey, options);
            res.send(result);
        })

        // bookings

        app.get('/bookings', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await bookingsCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        })

        app.patch('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const updateBooking = req.body;
            const updateDoc = {
                $set: {
                   status: updateBooking.status
                }
            }
            const result = await bookingsCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.get('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: new ObjectId(id) }
            const result = await bookingsCollection.findOne(qurey)
            res.send(result);
        })

        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const qurey = { _id: new ObjectId(id) }
            const result = await bookingsCollection.deleteOne(qurey);
            console.log(result)
            res.send(result);
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



app.get('/', (req, res) => {
    res.send('doctor is runnig')
})

app.listen(port, () => {
    console.log(`cars doctor is runnig on this port ${port}`)
})