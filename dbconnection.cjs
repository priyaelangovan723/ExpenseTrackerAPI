const {MongoClient} = require('mongodb')
let dbconnection
function connectToDb(callback){
    dbconnection = MongoClient.connect('mongodb+srv://priya:123@cluster0.ibqyhyw.mongodb.net/ExpenseTracker?retryWrites=true&w=majority').then(function(client){
        dbconnection = client.db()
        console.log("connected")
        callback()
    }).catch(function(error){
        callback(error)
    })
    
}
function getDb(){
    return dbconnection
}
module.exports = {connectToDb,getDb}