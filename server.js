const express = require('express')
const app = express()
app.use(express.json({extended:false }))
const connectDb = require('./config/connection')

connectDb()
app.use('/api/registeruser',require('./routes/apis/registerUser'))
app.use('/api/auth',require('./routes/apis/auth'))
app.listen(3001, () => {
    console.log('App listening on port 3000!');
});

