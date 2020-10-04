const mongoose = require('mongoose')


const ReportedTippSchema = mongoose.Schema({
    title: String,
    category: String,
    level: String,
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

module.exports = mongoose.model('ReportedTipps', ReportedTippSchema)