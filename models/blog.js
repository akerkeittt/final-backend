const mongoose = require('mongoose');

module.exports = (blogDB) => {
    const blogSchema = new mongoose.Schema({
        title: { type: String, required: true },
        body: { type: String, required: true },
        author: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
    });

    return blogDB.model('Blog', blogSchema);
};
