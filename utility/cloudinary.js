require('dotenv').config();
const cloudinary = require('cloudinary');
cloudinary.config({
  cloud_name: 'drtxrxwdk',
  api_key: '539699954367122',
  api_secret: 'ifsJZyo5XTk0K_X3j1rn2xlzhJ4',
});

module.exports = { cloudinary };
