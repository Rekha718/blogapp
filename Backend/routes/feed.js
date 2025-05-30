const express = require('express');
const router = express.Router();
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/feedController');

router.get('/api/posts', getPosts);
router.get('/api/posts/:id', getPostById);   // Route for single post by id
router.post('/api/posts', createPost);
router.put('/api/posts/:id', updatePost);
router.delete('/api/posts/:id', deletePost);

module.exports = router;
