const express = require('express')
const router = express.Router()
const fs = require('fs');

const users = require("/home/pi/Documents/htmlServer/data/users.json");

router.get('/', async function (req, res) {
    var filteredTipps = []
    try {
        /* if (req.query.minscore != null) {
          tipps.forEach(element => {
            if (element.score >= req.query.minscore) filteredTipps.unshift(element);
          })
        }
        else if (req.query.maxscore != null) {
          tipps.forEach(element => {
            if (element.score <= req.query.maxscore) filteredTipps.unshift(element);
          })
        }
        else {
          filteredTipps = tipps
        } */
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Serverside Error' });
    }
});

router.get('/:id', function (req, res) {
    var user = {};
    users.forEach(element => {
        if (element.id === req.params.id) user = element;
    })
    if (user.id != undefined) res.status(200).send(user);
    else res.status(404).json({ message: 'Tipp does not exist' });
});

router.post('/', function (req, res) {
    var exists = false
    users.forEach(element => {
        if (element.id === req.body.id) {
            console.log("Der User existiert schon")
            exists = true
            return
        }
    })
    if (exists) {
        res.status(200).json({ message: 'User existiert schon' });
    } else {
        users.unshift(req.body);
        console.log(users)
        fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
            if (err) {
                res.status(500).json({ message: 'Serverside Error' })
                throw err;
            }
            console.log("Done writing"); // Success 
        });
        res.status(201).json({ message: 'User erfolgreich erstellt erfolgreich' });
    }
});



router.patch('/:id', function (req, res) {
    var user = {}

    users.forEach(element => {
        if (element.id === req.body.id) user = element
    })

    for (var i = 0; i < tipps.length; i++) {
        if (tipps[i].id === req.params.id) {
            if (req.query.thumb === "down") {
                tipps[i].score -= 1
            }
            else if (req.query.thumb === "up") {
                tipps[i].score += 1
            }
            fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
                if (err) throw err;
                console.log("Done writing"); // Success 
            });
        }
    }
    res.status(200).json({ message: 'Patch erfolgreich' });
});

/*
router.delete('/:id', function (req, res) {
    for (var i = 0; i < tipps.length; i++) {
        if (tipps[i].id === req.params.id) {
            console.log(tipps[i]);
            tipps.splice(i, 1);
            fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
                if (err) throw err;
                console.log("Done writing"); // Success 
            });
        }
    }
    res.status(200).send(tipps);

    /* tipps.splice(req.body.tippNumber, 1)
    fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
      if (err) throw err;
      console.log("Done writing");
    });
}); */

module.exports = router
