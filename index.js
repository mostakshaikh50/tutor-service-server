const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { application } = require('express');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

//middle wares

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.s3sxdks.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// function verifyJWT(req, res, next){
//     console.log(req.headers.authorization);
//     const authHeader = req.headers.authorization;
//     if(!authHeader){
//         res.status(404).send({message: 'unauthorized access'});
//     }
//     const token = authHeader.split(' ')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
//         if(err){
//             res.status(404).send({message: 'unauthorized access'});
//         }
//         req.decoded = decoded;
//         next();
//     })
// }

async function run(){
    try{
       const serviceCollection = client.db('tutorUser').collection('services');
       const reviewCollection = client.db('tutorUser').collection('reviews');
       
    //    app.post('/jwt', (req, res) =>{
    //         const user = req.body;
    //         const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    //             expiresIn: '1h'
    //         });
    //         res.send({token});
    //    })
       
       app.get('/services', async(req, res) =>{
        const query ={}
        const cursor = serviceCollection.find(query).limit(3);
        const services = await cursor.toArray();
        res.send(services);
       });
       
       app.get('/allservices', async(req, res) =>{
        const query ={}
        const cursor = serviceCollection.find(query);
        const allServices = await cursor.toArray();
        res.send(allServices);
       });



       app.get('/services/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service);
       });

       app.get('/reviews', async(req, res) =>{
        let query ={};
        if(req.query.email){
            query = {
                email: req.query.email
            }
        }
        const cursor = reviewCollection.find(query);
        const reviews = await cursor.toArray();
        res.send(reviews);
       })

       app.post('/reviews', async(req, res) =>{
        const review = req.body;
        const result = await reviewCollection.insertOne(review);
        res.send(result); 
       });

       app.delete('/reviews/:id', async(req, res) =>{
          const id = req.params.id;
          const query = {_id: ObjectId(id)};
          const result = await reviewCollection.deleteOne(query);
          res.send(result);
       })

    //    app.get('/orders', verifyJWT, async(req, res) =>{
        
    //     let query ={}
    //     if(req.query.email){
    //         query = {
    //             email: req.query.email
    //         }
    //     }
    //     const cursor = orderCollection.find(query);
    //     const orders = await cursor.toArray();
    //     res.send(orders);
    //     console.log(orders);
    //    });

       
    }
    finally{

    }

}

run().catch(err => console.error(err));

app.get('/', (req, res) =>{
    res.send('tutor service server is running');
})

app.listen(port, () =>{
    console.log(`tutor service server running on ${port}`);
})