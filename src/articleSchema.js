const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    content: {
        type: String,
        required: [true, 'Title is required']
    },
    image: {
        type: Buffer,
    },
    comment: {
        type: [{text: String, time: String}],
        required: [true, 'Comment is required']
    },
    created: {
        type: Date,
        default: Date.now,
        required: [true, 'Created date is required']
    }
})

module.exports = mongoose.model('article', articleSchema);

