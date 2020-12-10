const express = require('express')
const router = express.Router()
const fs = require('fs');
const mongoose = require('mongoose');
const rfc6902 = require('rfc6902');
const Tipp = require('../models/Tipp')
const ReportedTipp = require('../models/ReportedTipp');
const { query } = require('express');

// const tipps = require("/home/pi/Documents/htmlServer/data/tipps.json");

router.get('/', async function (req, res) {
    /* req.query.forEach(element => {
        console.log(element);
    }); */

    var myQuery = req.query
    //var scoreFilter = {};

/*     Object.keys(req.query).forEach(k => {
        if (k === "minscore") {
            scoreFilter['minscore'] = req.query[k];
        }
    });
    console.log(scoreFilter); */
    try {
        if (req.query.minscore != null) {
            delete myQuery.minscore;
            const tipps2 = await Tipp.find(myQuery).sort({ "$natural": -1 });
            console.log(tipps2);
            const tipps = tipps2.filter(tipp => tipp.score >= req.query.minscore);
            console.log(tipps);
            res.status(200).json(tipps)
        } else if (req.query.maxscore != null) {
            delete myQuery.maxscore;
            const tipps2 = await Tipp.find(myQuery).sort({ "$natural": -1 });
            const tipps = tipps2.filter(tipp => tipp.score <= req.query.maxscore);
            res.status(200).json(tipps)
        } else {
            const tipps = await Tipp.find(req.query).sort({ "$natural": -1 });
            res.status(200).json(tipps)
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: err })
    }
});

//Old Get
/* router.get('/', async function (req, res) {
    try {
        if (req.query.minscore != null) {
            var filteredTipps = await tipps.filter(element => element.score >= req.query.minscore)
        }
        else if (req.query.maxscore != null) {
            var filteredTipps = await tipps.filter(element => element.score <= req.query.maxscore)
        }
        else {
            var filteredTipps = tipps
        }
        res.status(200).json(filteredTipps);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Serverside Error' });
    }
}); */

//Old Get by ID
/* router.get('/:id', async function (req, res) {
    var tipp = await tipps.find(element => element.id == req.params.id)
    if (tipp != undefined) res.status(200).send(tipp);
    else res.status(404).json({ message: 'Tipp does not exist' });
}); */

router.get('/:id', async function (req, res) {
    try {
        const tipp = await Tipp.findById(req.params.id);
        res.status(200).json(tipp)
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Post
/* router.post('/', function (req, res) {
    tipps.push(req.body);
    fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
        if (err) {
            res.status(500).json({ message: 'Serverside Error' })
            throw err;
        }
    });
    res.status(201).json({ message: 'Post erfolgreich' });
}); */

router.post('/', async function (req, res) {
    const tipp = new Tipp({
        title: req.body.title,
        category: req.body.category,
        level: req.body.level,
        source: req.body.source,
        official: req.body.official,
        postedBy: req.body.postedBy,
        score: req.body.score
    });

    try {
        const savedTipp = await tipp.save()
        res.status(200).json({ message: "Tipp erfolgreich gepostet" })
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Patch
/* router.patch('/:id', async function (req, res) {

    var i = await tipps.findIndex(element => element.id == req.params.id)

    if (i > -1) {
        if (req.body.thumb === "down") {
            tipps[i].score -= 1
        }
        else if (req.body.thumb === "up") {
            tipps[i].score += 1
        }
        if (tipps[i].reports == null) tipps[i].reports = 0;
        else if (req.body.thumb === "report") {
            tipps[i].reports += 1
        } else if (req.body.thumb === "unreport") {
            tipps[i].reports -= 1
        }
        fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'Patch erfolgreich' });
    }
    else if (i == -1) {
        res.status(404).json({ message: 'Tipp does not exist' })
    }
    else {
        res.status(500).json({ message: 'Serverside Error' })
    }
}); */

router.patch('/:id', async function (req, res) {
    try {
        const tipp = await Tipp.findById(req.params.id);

        if (req.body.thumb === "down") {
            tipp.score -= 1
        }
        else if (req.body.thumb === "up") {
            tipp.score += 1
        }
        else if (req.body.thumb === "report") {
            tipp.reports += 1
        } else if (req.body.thumb === "unreport") {
            tipp.reports -= 1
        }

        /* 
        const patch = req.body;
        rfc6902.applyPatch(tipp, patch);
        */

        if (tipp.score < -2 || (((tipp.score + 40) / tipp.reports) < 15)) {
            const reportedTipp = new ReportedTipp({
                title: tipp.title,
                category: tipp.category,
                level: tipp.level,
                source: tipp.source,
                official: tipp.official,
                postedBy: tipp.postedBy,
                score: tipp.score
            });

            try {
                console.log("moved to reportedTipps");
                const savedTReportedTipp = await reportedTipp.save()
                const deletedTipp = await Tipp.deleteOne({ _id: req.params.id })
                res.status(200).json({ message: "Tipp erfolgreich verschoben" })
            }
            catch (err) {
                res.status(404).json({ message: err })
            }
        } else {
            tipp.save();
            console.log("just patched");
            res.status(200).send(tipp);
        }
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Delete
/* router.delete('/:id', async function (req, res) {

    var i = await tipps.findIndex(element => element.id == req.params.id)

    if (i > -1) {
        tipps.splice(i, 1);
        fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
            if (err) throw err;
        });
        res.status(200).json({ message: 'Tipp successfull deleted' });
    }
    else if (i == -1) {
        res.status(404).json({ message: 'Tipp does not exist' })
    }
    else {
        res.status(500).json({ message: 'Serverside Error' })
    }
}); */

router.delete('/:id', async function (req, res) {
    try {
        const deletedTipp = await Tipp.deleteOne({ _id: req.params.id })
        res.status(200).send(deletedTipp);
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

module.exports = router