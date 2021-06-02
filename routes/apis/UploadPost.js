const express = require('express');
const routes = express();
const { check, validationResult } = require('express-validator/check');
const auth = require('../../middleware/auth');
const Post = require('../../model/UploadPost');
const User = require('../../model/registerUser');
const { cloudinary } = require('../../utility/cloudinary');
routes.post(
  '/',
  [auth],
  [
    check('title', 'Text is Required').not().isEmpty(),
    check('description', 'Description is Required').not().isEmpty(),
    check('uploadFile', 'File is Required').not().isEmpty(),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, breifDescription, uploadFile } = req.body;
    try {
      const user = await User.findById(req.user.id).select('-password');

      let fileStr = uploadFile;
      const postPath = await cloudinary.v2.uploader.upload(
        fileStr,
        { folder: 'upload-posts' },
        function (error, result) {
          console.log(result, error);
        }
      );
      console.log(postPath.url);
      const newPost = new Post({
        title,
        description,
        breifDescription,
        uploadFile: postPath.url,
        name: user.name,
        user: req.user.id,
      });
      const post = await newPost.save();
      // res.status(200).json('Post Upload Success fully');
      res.status(200).json(post);
    } catch (error) {
      console.log(error);
      res.status(500).json('Server Error');
    }
  }
);
routes.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    res.status(500).json('Server Error');
  }

  // const publicIds = resources.map((file) => file.public_id);
});

routes.get('/:id', auth, async (req, res) => {
  try {
    const posts = await Post.findById(req.params.id);
    if (!posts) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    res.json(posts);
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.status(500).json('Server Error');
  }

  // const publicIds = resources.map((file) => file.public_id);
});
routes.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(post);
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Autherized' });
    }
    if (!post) {
      return res.status(404).json({ msg: 'Post Not Found' });
    }
    await post.remove();
    res.json({ msg: 'Post Removed' });
  } catch (error) {
    console.log(error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Post Not Found' });
    }

    res.status(500).json('Server Error');
  }

  // const publicIds = resources.map((file) => file.public_id);
});

routes.put('/like/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: 'Post alredy liked' });
    }
    post.likes.unshift({ user: req.user.id });
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error);
  }
});
routes.put('/unlike/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: 'Post has not Like' });
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1);
    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.log(error);
  }
});
routes.post(
  '/comment/:id',
  [auth],
  [check('text', 'Text is Required').not().isEmpty()],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        user: req.user.id,
      };
      post.comments.unshift(newComment);
      post.save();
      // res.status(200).json('Post Upload Success fully');
      res.status(200).json(post.comments);
    } catch (error) {
      console.log(error);
      res.status(500).json('Server Error');
    }
  }
);
routes.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  console.log(req.params);
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    if (!comment) {
      return res.status(404).json({ msg: 'Comment Doesnot exit' });
    }
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User Not Autheroize' });
    }
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.json(post.comments);
  } catch (error) {
    console.log(error);
    res.status(500).json('Server Error');
  }
});
module.exports = routes;
