const express = require('express')
const router = express.Router()
const fs = require('fs');

const challenges = require("/home/pi/Documents/htmlServer/data/challenges.json");


router.get('/', async function (req, res) {
    try {
        res.status(200).send(challenges);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Serverside Error' });
    }
});

router.get('/:id', function (req, res) {
    var challenge = {};
    challenges.forEach(element => {
        if (element.id === req.params.id) challenge = element;
    })
    if (challenge.id != undefined) res.status(200).send(challenge);
    else res.status(404).json({ message: 'Challenge does not exist' });
});

router.post('/', function (req, res) {
    challenges.unshift(req.body);
    fs.writeFile("/home/pi/Documents/htmlServer/data/challenges.json", JSON.stringify(challenges), err => {
        if (err) {
            res.status(500).json({ message: 'Serverside Error' })
            throw err;
        }
        console.log("Done writing"); // Success 
    });
    res.status(201).json({ message: 'Post erfolgreich' });
});

router.patch('/:id', function (req, res) {
    console.log("patch");

    for (var i = 0; i < challenges.length; i++) {
        if (challenges[i].id === req.params.id) {
            if (req.query.thumb === "down") {
                challenges[i].score -= 1
            }
            else if (req.query.thumb === "up") {
                challenges[i].score += 1
            }
            fs.writeFile("/home/pi/Documents/htmlServer/data/challenges.json", JSON.stringify(challenges), err => {
                if (err) throw err;
                console.log("Done writing"); // Success 
            });
        }
    }
    res.status(200).json({ message: 'Patch erfolgreich' });
});

router.delete('/:id', function (req, res) {
    for (var i = 0; i < challenges.length; i++) {
        if (challenges[i].id === req.params.id) {
            console.log(challenges[i]);
            challenges.splice(i, 1);
            fs.writeFile("/home/pi/Documents/htmlServer/data/challenges.json", JSON.stringify(challenges), err => {
                if (err) throw err;
                console.log("Done writing"); // Success 
            });
        }
    }
    res.status(200).send(challenges);

    /* challenges.splice(req.body.tippNumber, 1)
    fs.writeFile("/home/pi/Documents/htmlServer/data/challenges.json", JSON.stringify(challenges), err => {
      if (err) throw err;
      console.log("Done writing");
    });*/
});

module.exports = router