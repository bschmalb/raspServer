const mongoose = require('mongoose')


const FeebackSchema = mongoose.Schema({
    feedback: String,
    feedbackType: String,
    userID: String,
    userName: String,
})

module.exports = mongoose.model('Feedbacks', FeebackSchema)