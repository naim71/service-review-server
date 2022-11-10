const express = require('express');
const cors = require('cors');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

//middle wares
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4evolx3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection =client.db('serviceReview').collection('services');

        app.get('/services', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });
        app.get('/servicesById', async(req, res) =>{
            const query = {};
            const cursor = serviceCollection.find(query).sort({_id:-1}).limit(3);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async(req, res)=> {
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
    }
    finally{

    }
}

run().catch(err => console.error(err))


app.get('/', (req, res) =>{
    res.send('Service Review Server is running')
})

app.listen(port, ()=>{
    console.log(`Service Review Server Running on ${port}`)
})