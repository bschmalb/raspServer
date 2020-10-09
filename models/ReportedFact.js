const mongoose = require('mongoose')


const ReportedFactSchema = mongoose.Schema({
    title: String,
    category: String,
    source: String,
    official: String,
    postedBy: String,
    isLoved: {
        type: Number,
        default: 0
    },
    isSuprised: {
        type: Number,
        default: 0
    },
    isAngry: {
        type: Number,
        default: 0
    },
    reports: {
        type: Number,
        default: 0
    },
})

module.exports = mongoose.model('ReportedFacts', ReportedFactSchema)