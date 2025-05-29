const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/posts/');
  },
  filename: function(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: function(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (jpeg, jpg, png)'));
  }
});

// Create post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { content } = req.body;
    const post = new Post({
      author: req.user._id,
      content,
      image: req.file ? `/uploads/posts/${req.file.filename}` : undefined
    });

    await post.save();
    await post.populate('author', 'username name avatar');

    // Add post to user's posts
    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: post._id }
    });

    res.status(201).json(post);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error al crear la publicación' });
  }
});

// Get feed posts
router.get('/feed', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const following = user.following;
    following.push(req.user._id); // Include user's own posts

    const posts = await Post.find({
      author: { $in: following }
    })
    .populate('author', 'username name avatar')
    .populate('comments.author', 'username name avatar')
    .sort('-createdAt')
    .limit(20);

    res.json(posts);
  } catch (error) {
    console.error('Error getting feed:', error);
    res.status(500).json({ message: 'Error al obtener el feed' });
  }
});

// Get user's posts
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.params.userId })
      .populate('author', 'username name avatar')
      .populate('comments.author', 'username name avatar')
      .sort('-createdAt');

    res.json(posts);
  } catch (error) {
    console.error('Error getting user posts:', error);
    res.status(500).json({ message: 'Error al obtener las publicaciones del usuario' });
  }
});

// Like post
router.post('/:postId/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Ya has dado me gusta a esta publicación' });
    }

    post.likes.push(req.user._id);
    await post.save();

    res.json({ message: 'Me gusta añadido correctamente' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Error al dar me gusta' });
  }
});

// Unlike post
router.post('/:postId/unlike', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'No has dado me gusta a esta publicación' });
    }

    post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    await post.save();

    res.json({ message: 'Me gusta eliminado correctamente' });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Error al quitar el me gusta' });
  }
});

// Add comment
router.post('/:postId/comments', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    post.comments.push({
      author: req.user._id,
      content
    });

    await post.save();
    await post.populate('comments.author', 'username name avatar');

    res.status(201).json(post.comments[post.comments.length - 1]);
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error al añadir el comentario' });
  }
});

// Save post
router.post('/:postId/save', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const user = await User.findById(req.user._id);
    if (user.savedPosts.includes(req.params.postId)) {
      return res.status(400).json({ message: 'Ya has guardado esta publicación' });
    }

    user.savedPosts.push(req.params.postId);
    post.savedBy.push(req.user._id);
    await Promise.all([user.save(), post.save()]);

    res.json({ message: 'Publicación guardada correctamente' });
  } catch (error) {
    console.error('Error saving post:', error);
    res.status(500).json({ message: 'Error al guardar la publicación' });
  }
});

// Unsave post
router.post('/:postId/unsave', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Publicación no encontrada' });
    }

    const user = await User.findById(req.user._id);
    if (!user.savedPosts.includes(req.params.postId)) {
      return res.status(400).json({ message: 'No has guardado esta publicación' });
    }

    user.savedPosts = user.savedPosts.filter(id => id.toString() !== req.params.postId);
    post.savedBy = post.savedBy.filter(id => id.toString() !== req.user._id.toString());
    await Promise.all([user.save(), post.save()]);

    res.json({ message: 'Publicación eliminada de guardados correctamente' });
  } catch (error) {
    console.error('Error unsaving post:', error);
    res.status(500).json({ message: 'Error al eliminar la publicación de guardados' });
  }
});

// Get saved posts
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedPosts',
      populate: [
        { path: 'author', select: 'username name avatar' },
        { path: 'comments.author', select: 'username name avatar' }
      ],
      options: { sort: { createdAt: -1 } }
    });

    res.json(user.savedPosts);
  } catch (error) {
    console.error('Error getting saved posts:', error);
    res.status(500).json({ message: 'Error al obtener las publicaciones guardadas' });
  }
});

module.exports = router; 