const express = require('express');
const router = express.Router();
const {
  getPosts,
  getRecentPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');

router.get('/', getPosts);
// Explicitly registered before /:id so Express does not capture 'recent' as a route param
router.get('/recent', getRecentPosts);
router.get('/:id', getPostById);
router.post('/', createPost);
router.put('/:id', updatePost);
router.delete('/:id', deletePost);

module.exports = router;
