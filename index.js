const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 5000
const app = express()

app.use(cors())
app.use(express.json())

// 1jannatjui414
// mongoserver10

// mongo code

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://1jannatjui414:mongoserver10@cluster0.jwr0f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("usersDB");
    const userCollection = database.collection("users");
    // read
   app.get('/users', async(req, res)=>{
    const users = userCollection.find()
    const newUser =await users.toArray()
    res.send(newUser);
   })

  //  get for update
  app.get('/users/:id', async(req, res)=>{
   const id =req.params.id
   const query ={_id: new ObjectId(id)}
   const user =await userCollection.findOne(query)
   res.send(user)
  })

  

// add user bt post method
app.post('/users', async(req, res) =>{
    const user =req.body
    console.log('new user', user)
    const result =await userCollection.insertOne(user)
    res.send(result);
})

// put method
app.put('/users/:id', async(req, res)=>{
  const id =req.params.id
  const user =req.body
  console.log(user, id)
  const filter ={_id: new ObjectId(id)}
  const options ={upsert :true}
  const updatedUser ={
    $set :{
    name: user.name,
    email:user.email
    }
  }
  const result =await userCollection.updateOne(filter, updatedUser, options)
  res.send(result);
})

// delete method
app.delete('/users/:id', async(req, res)=>{
  const id =req.params.id
  console.log('please delete from database ', id)
  const query ={_id: new ObjectId(id)}
  const result =await userCollection.deleteOne(query)
  res.send(result);
})

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) =>{
    res.send('Simple curd is running')
})



app.listen(port, () =>{
    console.log(`Simple curd is running on the port: ${port}`)
})