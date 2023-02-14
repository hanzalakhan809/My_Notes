const connectToMongo = require('./db');
const express = require('express')

connectToMongo();

const app = express()
const port = 5000
app.use(express.json());  //IT IS A MIDDLEWARE
app.use(express.urlencoded({
  extended: false
}));

//AVAILABLE ROUTES
app.use('/api/auth',require('./routes/auth.js'));
app.use('/api/note',require('./routes/note'));


//TO START LOCAL HOST ON MENTIONED PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})