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
        const reviewCollection =client.db('serviceReview').collection('reviews');

        app.post('/services', async (req, res) =>{
            const service = req.body;
            console.log(service);
            const result = await serviceCollection.insertOne(service)
            res.send(result);
        });

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
        });
        
        app.post('/reviews', async(req, res)=>{
            const review = req.body;
            console.log(review);
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })
        app.get('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id: ObjectId(id)};
            const service = await reviewCollection.findOne(query);
            res.send(service);
        })
        app.delete('/reviews/:id', async(req, res)=>{
            const id = req.params.id;
            console.log('trying to delete',id);
            const query = {_id: ObjectId(id)};
            const result = await reviewCollection.deleteOne(query);
            console.log(result);
            res.send(result);
        })

        app.get('/reviews', async(req,res) =>{
            let query = {};
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })
        app.get('/reviews/:serviceId', async(req,res) =>{
            const ser = req.params.serviceId;
            const query = {serviceId: ser};
            const review = await reviewCollection.find(query);
            const collection = await review.toArray();
            res.send(collection);
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