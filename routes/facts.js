/* const express = require('express')
const router = express.Router()
const fs = require('fs');

const facts = require("/home/pi/Documents/htmlServer/data/facts.json");


router.get('/', async function (req, res) {
    try {
      if (req.query.minscore != null) {
        var filteredFacts = await facts.filter(element => element.score >= req.query.minscore)
      }
      else if (req.query.maxscore != null) {
        var filteredFacts = await facts.filter(element => element.score <= req.query.maxscore)
      }
      else {
        var filteredFacts = facts
      }
      res.status(200).json(filteredFacts);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Serverside Error' });
    }
  });
  
  router.get('/:id', async function (req, res) {
    var fact = await facts.find(element => element.id == req.params.id)
    if (fact != undefined) res.status(200).send(fact);
    else res.status(404).json({ message: 'Fakt does not exist' });
  });
  
  router.post('/', function (req, res) {
    facts.push(req.body);
    fs.writeFile("/home/pi/Documents/htmlServer/data/facts.json", JSON.stringify(facts), err => {
      if (err) {
        res.status(500).json({ message: 'Serverside Error' })
        throw err;
      }
    });
    res.status(201).json({ message: 'Post erfolgreich' });
  });
  
  router.patch('/:id', async function (req, res) {
  
    var i = await facts.findIndex(element => element.id == req.params.id)
  
    if (i > -1) {
      if (req.query.thumb === "down") {
        facts[i].score -= 1
      }
      else if (req.query.thumb === "up") {
        facts[i].score += 1
      }
      fs.writeFile("/home/pi/Documents/htmlServer/data/facts.json", JSON.stringify(facts), err => {
        if (err) throw err;
      });
      res.status(200).json({ message: 'Patch erfolgreich' });
    }
    else if (i == -1) {
      res.status(404).json({ message: 'Fakt does not exist' })
    }
    else {
      res.status(500).json({ message: 'Serverside Error' })
    }
  });
  
  router.delete('/:id', async function (req, res) {
  
    var i = await facts.findIndex(element => element.id == req.params.id)
  
    if (i > -1) {
      facts.splice(i, 1);
      fs.writeFile("/home/pi/Documents/htmlServer/data/facts.json", JSON.stringify(facts), err => {
        if (err) throw err;
      });
      res.status(200).json({ message: 'Fakt successfull deleted' });
    }
    else if (i == -1) {
      res.status(404).json({ message: 'Fakt does not exist' })
    }
    else {
      res.status(500).json({ message: 'Serverside Error' })
    }
  });

module.exports = router */