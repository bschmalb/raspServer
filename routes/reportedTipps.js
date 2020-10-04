const express = require('express')
const router = express.Router()
const fs = require('fs');
const rfc6902 = require('rfc6902');
const ReportedTipp = require('../models/ReportedTipp')

//const reportedTipps = require("/home/pi/Documents/htmlServer/data/reportedTipps.json");

router.get('/', async function (req, res) {
    try {
        if (req.query.minscore != null){
            const reportedTipps = await ReportedTipp.find({score: { $gt: req.query.minscore }})
            res.status(200).json(reportedTipps)
        } else if (req.query.maxscore != null) {
            const reportedTipps = await ReportedTipp.find({score: { $lt: req.query.maxscore }})
            res.status(200).json(reportedTipps)
        } else {
            const reportedTipps = await ReportedTipp.find(req.query);
            res.status(200).json(reportedTipps)
        }
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

//Old Get
/* router.get('/', async function (req, res) {
    try {
        if (req.query.minscore != null) {
            var filteredTipps = await reportedTipps.filter(element => element.score >= req.query.minscore)
        }
        else if (req.query.maxscore != null) {
            var filteredTipps = await reportedTipps.filter(element => element.score <= req.query.maxscore)
        }
        else {
            var filteredTipps = reportedTipps
        }
        res.status(200).json(filteredTipps);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Serverside Error' });
    }
}); */

//Old Get by ID
/* router.get('/:id', async function (req, res) {
    var tipp = await reportedTipps.find(element => element.id == req.params.id)
    if (tipp != undefined) res.status(200).send(tipp);
    else res.status(404).json({ message: 'Tipp does not exist' });
}); */

router.get('/:id', async function (req, res) {
    try {
        const tipp = await ReportedTipp.findById(req.params.id);
        res.status(200).json(tipp)
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Post
/* router.post('/', function (req, res) {
    reportedTipps.push(req.body);
    fs.writeFile("/home/pi/Documents/htmlServer/data/reportedTipps.json", JSON.stringify(reportedTipps), err => {
        if (err) {
            res.status(500).json({ message: 'Serverside Error' })
            throw err;
        }
    });
    res.status(201).json({ message: 'Post erfolgreich' });
}); */

router.post('/', async function (req, res) {
    const tipp = new ReportedTipp({
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
        res.status(200).json({ message: "Tipp erfolgreich gepostet"})
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Patch
/* router.patch('/:id', async function (req, res) {

    var i = await reportedTipps.findIndex(element => element.id == req.params.id)

    if (i > -1) {
        if (req.body.thumb === "down") {
            reportedTipps[i].score -= 1
        }
        else if (req.body.thumb === "up") {
            reportedTipps[i].score += 1
        }
        if (reportedTipps[i].reports == null) reportedTipps[i].reports = 0;
        else if (req.body.thumb === "report") {
            reportedTipps[i].reports += 1
        } else if (req.body.thumb === "unreport") {
            reportedTipps[i].reports -= 1
        }
        fs.writeFile("/home/pi/Documents/htmlServer/data/reportedTipps.json", JSON.stringify(reportedTipps), err => {
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
        const tipp = await ReportedTipp.findById(req.params.id);
        
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

        tipp.save();
        res.status(200).send(tipp);
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Delete
/* router.delete('/:id', async function (req, res) {

    var i = await reportedTipps.findIndex(element => element.id == req.params.id)

    if (i > -1) {
        reportedTipps.splice(i, 1);
        fs.writeFile("/home/pi/Documents/htmlServer/data/reportedTipps.json", JSON.stringify(reportedTipps), err => {
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
        const deletedTipp = await ReportedTipp.deleteOne({_id: req.params.id})
        res.status(200).send(deletedTipp);
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

module.exports = router