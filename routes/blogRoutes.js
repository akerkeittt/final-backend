const express = require('express');
const mongoose = require('mongoose');


const blogDB = mongoose.createConnection('mongodb://127.0.0.1:27017/blogDB');
const Blog = require('../models/blog')(blogDB);

const router = express.Router();

router.post('/', async (req, res) => {
    const { title, body, author } = req.body;
    if (!title || !body) {
        return res.status(400).json({ error: 'Title and body are required' });
    }

    try {
        const newBlog = new Blog({ title, body, author });
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create the blog post' });
    }
});

router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find();
        res.status(200).json(blogs);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch blogs' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(blog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch the blog post' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );
        if (!updatedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json(updatedBlog);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update the blog post' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ error: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete the blog post' });
    }
});

module.exports = router;
