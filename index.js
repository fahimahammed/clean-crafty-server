const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;

const app = express();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('working')
})
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zpqcv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

console.log(uri)

client.connect(err => {
  const serviceCollection = client.db("cleanCrafty").collection("services");
  const adminCollection = client.db("cleanCrafty").collection("admin");
  const orderCollection = client.db("cleanCrafty").collection("orders");
  const reviewCollection = client.db("cleanCrafty").collection("reviews");


  //get service
  app.get('/services', (req, res) => {
    serviceCollection.find()
    .toArray((err, items) => {
        res.send(items);
        //console.log(items);
    })
})

// add service
  app.post('/addService', (req, res) => {
    const newService = req.body;
    serviceCollection.insertOne(newService)
    .then(result => console.log(result.insertedCount))
    res.send(result.insertedCount > 0)
})

// make admin
app.post('/admin/add', (req, res) => {
  const newService = req.body;
  adminCollection.insertOne(newService)
  .then(result => console.log(result.insertedCount))
  res.send(result.insertedCount > 0)
})


// add order
app.post('/addOrder', (req, res) => {
  const newOrder = req.body;
  orderCollection.insertOne(newOrder)
  .then(result => console.log(result.insertedCount))
  res.send(result.insertedCount > 0)
})

//add review
app.post('/addReview', (req, res) => {
  const newReview = req.body;
  reviewCollection.insertOne(newReview)
  .then(result => console.log(result.insertedCount))
  res.send(result.insertedCount > 0)
})

// show review
app.get('/review', (req, res) => {
  reviewCollection.find()
  .toArray((err, items) => {
      res.send(items);
      //console.log(items);
  })
})


// get admin
app.get('/admin/:email', (req, res) => {
  adminCollection.find({email: req.params.email})
  .toArray((err, items) => {
      res.send(items);
      //console.log(items);
  })
})


//order by email
app.get('/orders/:email', (req, res) => {
  orderCollection.find({email: req.params.email})
  .toArray((err, items) => {
      res.send(items);
      //console.log(items);
  })
})

// get all order (admin)
app.get('/orders', (req, res) => {
  orderCollection.find()
  .toArray((err, items) => {
      res.send(items);
      //console.log(items);
  })
})


//update status
app.patch('/update/status/:id', (req, res)=>{
  console.log(req.body.status)
  orderCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set: {status: req.body.status}
    })
    .then (result => {
      res.send(result.modifiedCount > 0)
    })
  
})


//manage service (delete service)
app.delete('/delete/:id', (req, res) => {
  const id = ObjectId(req.params.id);
  serviceCollection.findOneAndDelete({_id: id})
  .then(documents => res.send(!!documents.value));
  
})
  
  //client.close();
});


app.listen(port, ()=>{
    console.log('Listening');
})