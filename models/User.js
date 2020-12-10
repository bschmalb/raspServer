const mongoose = require('mongoose')


const UserSchema = mongoose.Schema({
    phoneId: String,
    name: {
        type: String,
        default: "User123"
    },
    age: {
        type: String,
        default: ""
    },
    gender: {
        type: String,
        default: ""
    },
    hideInfo: {
        type: Boolean,
        default: false
    },
    checkedTipps: {
        type: [String],
        default: []
    },
    savedTipps: {
        type: [String],
        default: []
    },
    savedFacts: {
        type: [String],
        default: []
    },
    reports: {
        type: Number,
        default: 0
    },
    log: [ {
        id: String,
        kilometer: Number,
        meat: Number,
        cooked: Number,
        foodWaste: Number,
        drinks: Number,
        shower: Number,
        binWaste: Number,
        date: String,
    } ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Users', UserSchema)