const mongoose = require('mongoose')


const FactSchema = mongoose.Schema({
    title: String,
    category: String,
    source: String,
    official: String,
    postedBy: String,
    score: {
        type: Number,
        default: 0
    },
    reports: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('Facts', FactSchema)