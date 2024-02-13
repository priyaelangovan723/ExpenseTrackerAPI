const express =require('express')
const cors =require('cors')
const {connectToDb, getDb} = require('./dbconnection.cjs')
const { MongoDBCollectionNamespace, ObjectId } = require('mongodb')
const bodyparser = require('body-parser')
const app = express()
app.use(bodyparser.json())
app.use(cors())
connectToDb(function(error){
    if(error){
        console.log('Could not establish connection')
        console.log(error)
    }
    else{
        const port = process.env.PORT || 8000
        app.listen(port)
        db = getDb()
        console.log(`Listening on port ${port}`)
        
    }
})
    

app.get('/',function(request,response){
    response.send('working fine')
})

app.post('/add', function(request,response){
    db.collection('Sample').insertOne(request.body).then(function(){
        response.status(201).json({
            "status":"entry added successfully"
        })
    }).catch(function(){
            response.status(500).json({
                "status":"entry not added"
            })
    })
})

app.get('/get-entries', function(request, response) {
    
    const entries = []
    db.collection('Sample')
    .find()
    .forEach(entry => entries.push(entry))
    .then(function() {
        response.status(200).json(entries)
    }).catch(function() {
        response.status(404).json({
            "status" : "Could not fetch documents"
        })
    })
})

app.delete('/delete', function(request, response) {
    if(ObjectId.isValid(request.query.id)){
        db.collection('Sample').deleteOne({
            _id :new ObjectId(request.query.id)
        }).then(function(){
            response.status(200).json({
                "status" : "Entry successfully deleted"
            })
        }).catch(function(){
            response.status(500).json({
                "status":"Entry not deleted"
            })
        })
    }
    else{
        response.status(500).json({
            "status":"ObjectId is not valid"
        })
    }
})



app.patch('/update/:id', function(request,response){
    if(ObjectId.isValid(request.params.id)){
        console.log(request.params.id)
        db.collection('Sample').updateOne(
            { _id : new ObjectId(request.params.id)},
            {  $set : request.body }
        ).then(function(){
            response.status(200).json({
                "status" : "Entry updated successfully"
            })
        }).catch(function(){
            response.status(500).json({
                "staus" :" Update not successful"
            })
        })
    }
    else{
        response.json({
            "status" : "ObjectId is not valid"
        })
    }
   
})
