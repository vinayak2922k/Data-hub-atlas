const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('authorId', 'name email')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Posts retrieved successfully',
      data: posts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve posts',
      data: null,
    });
  }
};

const getRecentPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('authorId', 'name email');

    return res.status(200).json({
      success: true,
      message: 'Recent posts retrieved successfully',
      data: posts,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve recent posts',
      data: null,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
        data: null,
      });
    }

    const post = await Post.findById(id).populate('authorId', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'That post has already left the building',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post retrieved successfully',
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve post',
      data: null,
    });
  }
};

const createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    if (!authorId || !mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: 'A valid authorId is required to publish a post',
        data: null,
      });
    }

    const authorExists = await User.findById(authorId);
    if (!authorExists) {
      return res.status(404).json({
        success: false,
        message: 'Author account not found in database',
        data: null,
      });
    }

    const post = await Post.create({ title, content, authorId });
    await post.populate('authorId', 'name email');

    return res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: post,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        data: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to create post',
      data: null,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
        data: null,
      });
    }

    // Disallow altering authorId during inline post edit
    const updateData = { ...req.body };
    delete updateData.authorId;

    const post = await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate('authorId', 'name email');

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'That post has already left the building',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: post,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
        data: null,
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update post',
      data: null,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid post ID format',
        data: null,
      });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'That post has already left the building',
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
      data: post,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete post',
      data: null,
    });
  }
};

module.exports = {
  getPosts,
  getRecentPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
