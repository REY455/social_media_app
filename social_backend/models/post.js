const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  file: String,
  likes: { type: Number, default: 0 },
  comments: [{ text: String }]
});

module.exports = mongoose.model('Post', postSchema);
