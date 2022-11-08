const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
require('dotenv').config()

console.log(process.env.USER_NAME)

app.get('/', (req, res) => {
  res.send('Food Delivery Server Running')
})



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.b0mkc5r.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const serviceCollection = client.db('tourGuide').collection('service')

app.get('/services' ,async(req , res)=>{
  const query  = {}
  const cursor = serviceCollection.find(query)
  const result = await cursor.limit(3).toArray()
  res.send(result)
})
app.get('/all-services' ,async(req , res)=>{
  const query  = {}
  const cursor = serviceCollection.find(query)
  const result = await cursor.toArray()
  res.send(result)
})


app.listen(port, () => {
  console.log(`Food Delivery Server Running on port ${port}`)
})