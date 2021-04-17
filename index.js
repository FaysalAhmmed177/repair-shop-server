const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7p4ls.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 4800;

app.get('/', (req, res) => {
    res.send("It's working properly");
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const collection = client.db("repairShop").collection("servicesCollection");
    
    console.log('Database connected successfully');


});


app.listen(process.env.PORT || port);