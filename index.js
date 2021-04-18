const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7p4ls.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(fileUpload());

const port = 4800;

app.get('/', (req, res) => {
    res.send("It's working properly");
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const servicesCollection = client.db("repairShop").collection("servicesCollection");
    const userReviewsCollection = client.db("repairShop").collection("userReviewsCollection");
    const adminCollection = client.db("repairShop").collection("adminCollection");
    const ordersCollection = client.db("repairShop").collection("ordersCollection");


    console.log('Database connected successfully');


    app.post('/addAService', (req, res) => {
        console.log(req.body);
        const file = req.files.file;
        const name = req.body.name;
        const price = req.body.price;
        const description = req.body.description;

        const newImg = file.data;
        const encImg = newImg.toString('base64');

        var image = {
            contentType: file.mimetype,
            size: file.size,
            img: Buffer.from(encImg, 'base64')
        };

        servicesCollection.insertOne({ name, price, description, image })
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0);
            })
    });

    app.get('/services', (req, res) => {
        servicesCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/service/:id', (req, res) => {
        //console.log(req.params.id);
        servicesCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    });

    app.post('/usersReview', (req, res) => {
        const newReview = req.body;
        console.log('Adding new review', newReview);
        userReviewsCollection.insertOne(newReview)
            .then(result => {
                console.log('Inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.get('/reviews', (req, res) => {
        userReviewsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/orders', (req, res) => {
        const newOrders = req.body;
        console.log('New Orders', newOrders);
        ordersCollection.insertOne(newOrders)
            .then(result => {
                console.log('Inserted count', result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/orderList', (req, res) => {
        ordersCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/makeAdmin', (req, res) => {
        const newAdmin = req.body;
        console.log(newAdmin);

        adminCollection.insertOne(newAdmin)
            .then(result => {
                console.log(result);
                res.send(result.insertedCount > 0);
            })
    });

    app.post('/isAdmin', (req, res) => {
        const email = req.body.email;

        adminCollection.find({ email: email })
            .toArray((err, admins) => {
                res.send(admins.length > 0);
            })
    });


    app.delete('/delete/:id', (req, res) => {
        const id = ObjectId(req.params.id);
        servicesCollection.findOneAndDelete({ _id: id })
            .then((documents) => res.send(documents.value));
    })

});


app.listen(process.env.PORT || port);