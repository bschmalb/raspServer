const express = require('express')
const router = express.Router()
const fs = require('fs');
const mongoose = require('mongoose');
const rfc6902 = require('rfc6902');
const Feedback = require('../models/Feedback');


router.get('/', async function (req, res) {
    try {
        const feedbacks = await Feedback.find(req.query);
        res.status(200).json(feedbacks)
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

router.get('/:id', async function (req, res) {
    try {
        const feedback = await Feedback.findById(req.params.id);
        res.status(200).json(feedback)
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

router.post('/', async function (req, res) {
    const feedback = new Feedback({
        feedback: req.body.feedback,
        feedbackType: req.body.feedbackType,
        userID: req.body.userID,
        userName: req.body.userName
    });

    try {
        const savedFeedback = await feedback.save()
        res.status(200).json({ message: "Tipp erfolgreich gepostet" })
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

router.delete('/:id', async function (req, res) {
    try {
        const deletedFeedback = await Feedback.deleteOne({ _id: req.params.id })
        res.status(200).send(deletedFeedback);
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

module.exports = router