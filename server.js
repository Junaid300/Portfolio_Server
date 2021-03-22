const express = require('express')
const app = express()
var cors = require('cors')
app.use(express.json({extended:false }))
app.use(cors())
const connectDb = require('./config/connection')

connectDb()
app.use('/api/registeruser',require('./routes/apis/registerUser'))
app.use('/api/auth',require('./routes/apis/auth'))
app.listen(3001, () => {
    console.log('App listening on port 3000!');
});

