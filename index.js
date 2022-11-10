const express = require('express');
// const packageName = require('packageName');
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nrfxvyb.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      const serviceCollection = client.db('serviceReview').collection('services')
      const blogs = client.db('serviceReview').collection('blogs')
      const featuredService = client.db('serviceReview').collection('featuredServices')



      
      app.get('/featured', async(req, res)=>{
        const query = {}
        const cursor = featuredService.find(query);
        const fService = await cursor.toArray();
        res.send(fService)

      });


      app.get('/services', async(req, res)=>{
        const query = {}
        const cursor = serviceCollection.find(query);
        const Services = await cursor.toArray();
        res.send(Services)

      });


      


      app.post('/services', (req, res)=>{
        const insertService = req.body;
        const result = serviceCollection.insertOne(insertService);
        res.send(result)
    })

      app.get('/services/:id', async (req, res)=>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        
        const service = await serviceCollection.findOne(query)
        
        res.send(service)
    })

    app.put('/services/:id', async (req, res)=>{
      const id = req.params.id;
      const filter = {_id: ObjectId(id)};
      const newReview = req.body
      const option = {upsert: true}
      const addReview = {
        $push: {
          reviews: {
            id: ObjectId(),
            email: newReview.email,
            reviewMsg: newReview.review
          }
        }
      }
      const result = await serviceCollection.updateOne(filter, addReview, option);
      res.send(result)
      
  })
    



    }finally{

    }
}run().catch(err => console.error(err));



app.get('/', (req, res)=>{
    res.send('Server is running')
})
// app listen
app.listen(process.env.port || port, ()=>{
    console.log(`server is running on: ${port}`)
})