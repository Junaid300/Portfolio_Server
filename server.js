const express = require('express');
const app = express();
var cors = require('cors');
app.use(express.json({ extended: false, limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());
const connectDb = require('./config/connection');

connectDb();
app.use('/api/registeruser', require('./routes/apis/registerUser'));
app.use('/api/auth', require('./routes/apis/auth'));
app.use('/api/upload-post', require('./routes/apis/UploadPost'));
app.listen(3001, () => {
  console.log('App listening on port 3000!');
});
