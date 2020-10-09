const express = require('express')
const router = express.Router()
const fs = require('fs');
const mongoose = require('mongoose');
const rfc6902 = require('rfc6902');
const Fact = require('../models/Fact')
const ReportedFact = require('../models/ReportedFact')

// const Facts = require("/home/pi/Documents/htmlServer/data/Facts.json");

router.get('/', async function (req, res) {
    try {
        if (req.query.minscore != null) {
            const facts = await Fact.find({ score: { $gt: req.query.minscore } })
            res.status(200).json(facts)
        } else if (req.query.maxscore != null) {
            const facts = await Fact.find({ score: { $lt: req.query.maxscore } })
            res.status(200).json(facts)
        } else {
            const facts = await Fact.find(req.query);
            res.status(200).json(facts)
        }
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

router.get('/:id', async function (req, res) {
    try {
        const fact = await Fact.findById(req.params.id);
        res.status(200).json(fact)
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

router.post('/', async function (req, res) {
    const Fact = new Fact({
        title: req.body.title,
        category: req.body.category,
        source: req.body.source,
        official: req.body.official,
        postedBy: req.body.postedBy,
        score: req.body.score
    });

    try {
        const savedFact = await Fact.save()
        res.status(200).json({ message: "Fact erfolgreich gepostet" })
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

router.patch('/:id', async function (req, res) {
    try {
        const fact = await Fact.findById(req.params.id);

        if (req.body.thumb === "down") {
            fact.score -= 1
        }
        else if (req.body.thumb === "up") {
            fact.score += 1
        }
        else if (req.body.thumb === "report") {
            fact.reports += 1
        } else if (req.body.thumb === "unreport") {
            fact.reports -= 1
        }

        if (fact.score < -2 || fact.reports > 4) {
            const reportedFact = new ReportedFact({
                title: fact.title,
                category: fact.category,
                level: fact.level,
                source: fact.source,
                official: fact.official,
                postedBy: fact.postedBy,
                score: fact.score
            });
        
            try {
                console.log("moved to reportedFacts");
                const savedTReportedFact = await reportedFact.save()
                const deletedFact = await Fact.deleteOne({ _id: req.params.id })
                res.status(200).json({ message: "Fact erfolgreich verschoben" })
            }
            catch (err) {
                res.status(404).json({ message: err })
            }
        } else {
            fact.save();
            console.log("just patched");
            res.status(200).send(fact);
        }
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Delete
/* router.delete('/:id', async function (req, res) {

    var i = await Facts.findIndex(element => element.id == req.params.id)

    if (i > -1) {
        Facts.splice(i, 1);
        fs.writeFile("/home/pi/Documents/htmlServer/data/Facts.json", JSON.stringify(Facts), err => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'Fact successfull deleted' });
    }
    else if (i == -1) {
        res.status(404).json({ message: 'Fact does not exist' })
    }
    else {
        res.status(500).json({ message: 'Serverside Error' })
    }
}); */

router.delete('/:id', async function (req, res) {
    try {
        const deletedFact = await Fact.deleteOne({ _id: req.params.id })
        res.status(200).send(deletedFact);
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

module.exports = router