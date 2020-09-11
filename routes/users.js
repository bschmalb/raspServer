const express = require('express')
const router = express.Router()
const fs = require('fs');

const users = require("/home/pi/Documents/htmlServer/data/users.json");


router.get('/', async function (req, res) {
    try {
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Serverside Error' });
    }
});

router.get('/:id', function (req, res) {
    var user = users.find(element => element.id == req.params.id)
    if (user != undefined) res.status(200).send(user);
    else res.status(404).json({ message: 'Tipp does not exist' });
});

router.post('/', function (req, res) {
    var user = users.find(element => element.id == req.body.id)
    if (user != undefined) {
        res.status(200).json({ message: 'User existiert schon' });
    } else {
        users.push(req.body);
        fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
            if (err) {
                res.status(500).json({ message: 'Serverside Error' })
                throw err;
            }
        });
        res.status(201).json({ message: 'User erfolgreich erstellt erfolgreich' });
    }
});



router.patch('/:id', function (req, res) {

    var userIndex = users.findIndex(element => element.id == req.params.id)

    if (userIndex > -1) {
        try {
            if (req.body.name != null) {
                users[userIndex].name = req.body.name
            }
            if (req.body.checkedTipps != null) {
                var tippIndex = users[userIndex].checkedTipps.findIndex(element => element == req.body.checkedTipps)

                if (tippIndex > -1) {
                    users[userIndex].checkedTipps.splice(tippIndex, 1);
                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                    });
                } else if (tippIndex = -1) {
                    users[userIndex].checkedTipps.unshift(req.body.checkedTipps)
                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                    });
                }
            }
            if (req.body.savedTipps != null) {
                var tippIndex = users[userIndex].savedTipps.findIndex(element => element == req.body.checkedTipps)

                if (tippIndex > -1) {
                    users[userIndex].savedTipps.splice(tippIndex, 1);
                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                    });
                } else if (tippIndex = -1) {
                    users[userIndex].savedTipps.unshift(req.body.savedTipps)
                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                    });
                }
            }
            if (req.body.checkedChallenges != null) {
                var tippIndex = users[userIndex].checkedChallenges.findIndex(element => element == req.body.checkedTipps)

                if (tippIndex > -1) {
                    users[userIndex].checkedChallenges.splice(tippIndex, 1);
                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                    });
                } else if (tippIndex = -1) {
                    users[userIndex].checkedChallenges.unshift(req.body.checkedChallenges)
                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                    });
                }
            }
            if (req.body.savedChallenges != null) {
                var tippIndex = users[userIndex].savedChallenges.findIndex(element => element == req.body.checkedTipps)

                if (tippIndex > -1) {
                    users[userIndex].savedChallenges.splice(tippIndex, 1);
                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                    });
                } else if (tippIndex = -1) {
                    users[userIndex].savedChallenges.unshift(req.body.savedChallenges)
                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                    });
                }
            }
            if (req.body.log != null) {

                try {
                    if (users[userIndex].log == null) users[userIndex].log = [];

                    users[userIndex].log.push(req.body.log)

                    fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                        if (err) {
                            res.status(500).json({ message: 'Serverside Error' })
                            throw err;
                        }
                        console.log("Done writing"); // Success 
                    });
                    res.status(200).json(users[userIndex]);
                } catch (err) {
                    console.log(err);
                    res.status(400).json({ message: err });
                }
            }
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err });

        }
    } else {
        res.status(404).json({ message: "User does not exist" });
    }
});


router.delete('/:id', function (req, res) {

    var i = users.findIndex(element => element.id == req.params.id)
  
    if (i > -1) {
      users.splice(i, 1);
      fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
        if (err) throw err;
      });
      res.status(200).json({ message: 'User successfull deleted' });
    }
    else if (i == -1) {
      res.status(404).json({ message: 'User does not exist' })
    }
    else {
      res.status(500).json({ message: 'Serverside Error' })
    }
  });

module.exports = router
