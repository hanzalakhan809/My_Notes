const mongoose = require('mongoose');
mongoose.set('strictQuery', false);    //To HIDE ERROR IN BY DEFAULT IT IS TRUE 
const mongoURI ='mongodb+srv://hanzala:5HWNL2LSSg88dIJ9@hanzalaapi.xi87cen.mongodb.net/mynotes?retryWrites=true&w=majority';


//CONNECTING TO MONGO DATABASE USING ABOVE URI
const connectToMongo = ()=>{
    mongoose.connect(mongoURI,()=>{
        console.log('DATABASE CONNECTED SUCESSFULLY');
    })
}

module.exports = connectToMongo;
