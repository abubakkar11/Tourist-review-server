const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
require('dotenv').config()
var jwt = require('jsonwebtoken');

app.get('/', (req, res) => {
  res.send('Food Delivery Server Running')
})


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.b0mkc5r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    const serviceCollection = client.db('tourGuide').collection('service')
    const reviewCollection = client.db('tourGuide').collection('reviews')
    app.get('/services', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query)
      const result = await cursor.limit(3).toArray()
      res.send(result)
    })
    app.post('/jwt' , (req , res)=>{
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn:'1h'})
      res.send({token})
    })
    app.get('/all-services', async (req, res) => {
      const query = {}
      const cursor = serviceCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })
    app.put('/reviews/:id' , async(req , res) =>{
      const id =req.params.id;
      const filter = {_id : ObjectId(id)}
      console.log(req.body)
      const review = req.body;
      const option = {upsert : true}
      const updateUser = {
        $set:{
          message : review.message,
          retting : review.retting
        }
      }
      const result = await reviewCollection.updateOne(filter , updateUser , option)
      res.send(result )
    })
    app.post('/all-services' , async(req , res) =>{
      const services = req.body;
      const service = await serviceCollection.insertOne(services)
      res.send(service)
    })
    app.get('/all-services/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) }
      const result = await serviceCollection.findOne(query)
      res.send(result)
    })
    app.post('/reviews', async (req, res) => {
      const reviews = req.body;
      const review = await reviewCollection.insertOne(reviews)
      res.send(review)
    })
    app.delete('/reviews/:id' , async(req ,res) =>{
     const id = req.params.id;
     const query = {_id : ObjectId(id)}
     console.log(query)
     const result = await reviewCollection.deleteOne(query)
     res.send(result)
    })
    app.get('/reviews/:id' , async(req , res)=>{
      const id = req.params.id;
      const query = {_id : ObjectId(id)};
      const result = await reviewCollection.findOne(query)
      res.send(result)
    })
    app.get('/reviews' ,async(req,res) =>{
      let query = {}
      console.log(req.authorization)
      if(req.query.reviewId){
        query ={
          reviewId:req.query.reviewId
        }
      }
      if(req.query.email){
        query ={
          email:req.query.email
        }
      }
      const cursor = reviewCollection.find(query).sort({'retting' : -1})
      const result = await cursor.toArray()
      res.send(result)
    } )
  }
  finally {

  }
}
run().catch(err => console.error(err))

app.listen(port, () => {
  console.log(`Food Delivery Server Running on port ${port}`)
})