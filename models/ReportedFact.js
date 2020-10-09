const mongoose = require('mongoose')


const ReportedFactSchema = mongoose.Schema({
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

module.exports = mongoose.model('ReportedFacts', ReportedFactSchema)