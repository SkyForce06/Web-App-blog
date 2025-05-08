import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async (req, res) => {
  const { page } = req.query;

  try {
    const LIMIT = 8;
    const startIndex = (Number(page) - 1) * LIMIT;

    const total = await PostMessage.countDocuments({});
    const posts = await PostMessage.find().sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

    res.json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsBySearch = async (req, res) => {
  const { searchQuery, tags } = req.query;

  try {
    const title = new RegExp(searchQuery, "i");

    const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPostsByCreator = async (req, res) => {
  const { name } = req.query;

  try {
    const posts = await PostMessage.find({ name });

    res.json({ data: posts });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await PostMessage.findById(id);

    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  const newPostMessage = new PostMessage({
    ...post,
    creator: req.userId,
    likes: [],
    comments: [],
    createdAt: new Date().toISOString(),
  });

  try {
    await newPostMessage.save();

    res.status(201).json(newPostMessage);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, message, selectedFile, tags } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (String(post.creator) !== String(req.userId))
    return res.status(403).json({ message: "You are not authorized to edit this post" });

  const updatedPost = await PostMessage.findByIdAndUpdate(id, { title, message, tags, selectedFile }, { new: true });

  res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);

  if (!post) return res.status(404).json({ message: "Post not found" });

  if (String(post.creator) !== String(req.userId))
    return res.status(403).json({ message: "You are not authorized to delete this post" });

  await PostMessage.findByIdAndDelete(id);

  res.json({ message: "Post deleted successfully." });
};

export const likePost = async (req, res) => {
  const { id } = req.params;

  if (!req.userId) return res.json({ message: "Unauthenticated" });
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  try {
    const post = await PostMessage.findById(id);

    const hasLiked = post.likes.includes(req.userId);

    let updatedPost;

    if (hasLiked) {
      updatedPost = await PostMessage.findByIdAndUpdate(id, { $pull: { likes: req.userId } }, { new: true });
    } else {
      updatedPost = await PostMessage.findByIdAndUpdate(id, { $addToSet: { likes: req.userId } }, { new: true });
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const commentPost = async (req, res) => {
  const { id } = req.params;
  const { value } = req.body;

  const post = await PostMessage.findById(id);

  post.comments.push(value);

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

  res.json(updatedPost);
};
