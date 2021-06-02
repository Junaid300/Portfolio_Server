const mongoose = require('mongoose');

const UploadPost = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserRegistration',
  },
  title: {
    type: String,
    required: true,
  },
  breifDescription: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  uploadFile: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRegistration',
      },
    },
  ],
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRegistration',
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = UploadPostSchema = mongoose.model('post', UploadPost);
