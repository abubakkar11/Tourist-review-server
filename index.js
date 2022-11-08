const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
require('dotenv').config()

console.log(process.env.USER_NAME)

app.get('/', (req, res) => {
  res.send('Food Delivery Server Running')
})

app.listen(port, () => {
  console.log(`Food Delivery Server Running on port ${port}`)
})