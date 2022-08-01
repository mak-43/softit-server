const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(express.json())
app.use(cors({
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
  }));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bxqusfm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        await client.connect()

        const userCollection = client.db('Softit').collection('user')
        const productCollection = client.db('Softit').collection('products')
       

   
     

    
        
        ///useAdmin hook
        app.get('/admin/:email', async(req, res) =>{
            const email = req.params.email;
            const user = await userCollection.findOne({email: email});
            const isAdmin = user?.role === 'admin';
            res.send({admin: isAdmin})
          })
        
        ///useVendor hook
        app.get('/vendor/:email', async(req, res) =>{
            const email = req.params.email;
            const user = await userCollection.findOne({email: email});
            const isVendor = user?.role === 'vendor';
            res.send({vendor: isVendor})
          })
          /// get products 
          app.get('/products',async(req,res)=>{
            cursor=productCollection.find().sort({$natural:-1})
            const product=await cursor.toArray()
            res.send(product)
          })
          ///post product 
          app.post('/addproduct',async(req,res)=>{
            const product=req.body 
            const result=await productCollection.insertOne(product) 
            res.send(result)
          })



    }
    finally {

    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running Server !!!')
})
app.listen(port, () => {
    console.log('Listening to port', port)
})