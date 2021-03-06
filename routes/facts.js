const express = require('express')
const router = express.Router()
const fs = require('fs');
const mongoose = require('mongoose');
const rfc6902 = require('rfc6902');
const Fact = require('../models/Fact')
const ReportedFact = require('../models/ReportedFact')

// const Facts = require("/home/pi/Documents/htmlServer/data/Facts.json");

router.get('/', async function (req, res) {
  var myQuery = {...req.query};
  try {
    if (req.query.minscore != null) {
      delete myQuery.minscore;
      const facts2 = await Fact.find(myQuery).sort({ "$natural": -1 });
      const facts = facts2.filter(fact => fact.score >= req.query.minscore);
      res.status(200).json(facts)
    } else if (req.query.maxscore != null) {
      delete myQuery.maxscore;
      const facts2 = await Fact.find(myQuery).sort({ "$natural": -1 });
      const facts = facts2.filter(fact => fact.score <= req.query.maxscore);
      res.status(200).json(facts)
    } else {
      const facts = await Fact.find(req.query).sort({ "$natural": -1 });
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
  const fact = new Fact({
    title: req.body.title,
    category: req.body.category,
    source: req.body.source,
    isLoved: req.body.isLoved,
    isSurprised: req.body.isSurprised,
    isAngry: req.body.isAngry,
    score: req.body.score,
    official: req.body.official,
    postedBy: req.body.postedBy
  });

  try {
    const savedFact = await fact.save()
    res.status(200).json({ message: "Fact erfolgreich gepostet" })
  }
  catch (err) {
    res.status(404).json({ message: err })
  }
});

router.patch('/:id', async function (req, res) {
  try {
    const fact = await Fact.findById(req.params.id);

    if (req.body.thumb === "report") {
      fact.reports += 1
    } else if (req.body.thumb === "unreport") {
      fact.reports -= 1
    }
    if (req.body.isLoved != null) {
      fact.isLoved += req.body.isLoved
      fact.score += req.body.isLoved
    }
    if (req.body.isSurprised != null) {
      fact.isSurprised += req.body.isSurprised
      fact.score += req.body.isSurprised
    }
    if (req.body.isAngry != null) {
      fact.isAngry += req.body.isAngry
      fact.score += req.body.isAngry
    }
    if (req.body.score != null) {
      fact.score += req.body.score
    }

    if (fact.score < -2 || (((fact.score + 40) / fact.reports) < 15)) {
      const reportedFact = new ReportedFact({
        title: fact.title,
        category: fact.category,
        isLoved: fact.isLoved,
        isSurprised: fact.isSurprised,
        isAngry: fact.isAngry,
        score: fact.score,
        official: fact.official,
        postedBy: fact.postedBy,
        source: fact.source
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

router.delete('/:id', async function (req, res) {
  try {
    const deletedFact = await Fact.deleteOne({ _id: req.params.id })
    res.status(200).send(deletedFact);
  } catch (err) {
    res.status(404).json({ message: err })
  }
});

module.exports = router