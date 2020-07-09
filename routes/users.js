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
            console.log("User already exists")
            exists = true
            return
        }
    })
    if (exists) {
        res.status(200).json({ message: 'User existiert schon' });
    } else {
        users.push(req.body);
        fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
            if (err) {
                res.status(500).json({ message: 'Serverside Error' })
                throw err;
            }
            console.log("User successfully added"); // Success 
        });
        res.status(201).json({ message: 'User erfolgreich erstellt erfolgreich' });
    }
});



router.patch('/:id', function (req, res) {
    var userIndex = null

    for (var i = 0; i < users.length; i++) {
        if (users[i].id === req.params.id) {
            userIndex = i
            console.log("userindex = i");
            
        }
    }

    try {
        if (req.body.name != null && userIndex != null) {
            users[userIndex].name = req.body.name
        }
        if (req.body.checkedTipps != null && userIndex != null) {
            var tippChecked = false
            var tippIndex = null
            for (var i = 0; i < users[userIndex].checkedTipps.length; i++) {
                if (users[userIndex].checkedTipps[i] === req.body.checkedTipps) {
                    tippIndex = i
                    tippChecked = true
                    console.log("tippIndex = i");
                }
            }

            if (tippChecked && tippIndex != null) {
                console.log("delete Tipp");
                users[userIndex].checkedTipps.splice(tippIndex, 1);
                fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                    if (err) {
                        res.status(500).json({ message: 'Serverside Error' })
                        throw err;
                    }
                });
            } else {
                console.log("add Tipp");
                users[userIndex].checkedTipps.unshift(req.body.checkedTipps)
                fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                    if (err) {
                        res.status(500).json({ message: 'Serverside Error' })
                        throw err;
                    }
                });
            }
        }
        if (req.body.savedTipps != null && userIndex != null) {
            var tippSaved = false
            var tippIndex = null
            for (var i = 0; i < users[userIndex].savedTipps.length; i++) {
                if (users[userIndex].savedTipps[i] === req.body.savedTipps) {
                    tippIndex = i
                    tippSaved = true
                }
            }
            console.log(tippIndex);
            console.log(tippSaved);

            if (tippSaved && tippIndex != null) {
                users[userIndex].savedTipps.splice(tippIndex, 1);
                fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                    if (err) {
                        res.status(500).json({ message: 'Serverside Error' })
                        throw err;
                    }
                });
            } else {
                users[userIndex].savedTipps.unshift(req.body.savedTipps)
                fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                    if (err) {
                        res.status(500).json({ message: 'Serverside Error' })
                        throw err;
                    }
                });
            }
        }
        if (req.body.checkedChallenges != null && userIndex != null) {
            var challengeChecked = false
            var challengeIndex = null
            for (var i = 0; i < users[userIndex].checkedChallenges.length; i++) {
                if (users[userIndex].checkedChallenges[i] === req.body.checkedChallenges) {
                    challengeIndex = i
                    challengeChecked = true
                }
            }
            console.log(challengeIndex);
            console.log(challengeChecked);

            if (challengeChecked && challengeIndex != null) {
                users[userIndex].checkedChallenges.splice(challengeIndex, 1);
                fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                    if (err) {
                        res.status(500).json({ message: 'Serverside Error' })
                        throw err;
                    }
                });
            } else {
                users[userIndex].checkedChallenges.unshift(req.body.checkedChallenges)
                fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                    if (err) {
                        res.status(500).json({ message: 'Serverside Error' })
                        throw err;
                    }
                });
            }
        }
        if (req.body.savedChallenges != null && userIndex != null) {
            var challengeSaved = false
            var challengeIndex = null
            for (var i = 0; i < users[userIndex].savedChallenges.length; i++) {
                if (users[userIndex].savedChallenges[i] === req.body.savedChallenges) {
                    challengeIndex = i
                    challengeSaved = true
                }
            }
            console.log(challengeIndex);
            console.log(challengeSaved);

            if (challengeSaved && challengeIndex != null) {
                users[userIndex].savedChallenges.splice(challengeIndex, 1);
                fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                    if (err) {
                        res.status(500).json({ message: 'Serverside Error' })
                        throw err;
                    }
                });
            } else {
                users[userIndex].savedChallenges.unshift(req.body.savedChallenges)
                fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                    if (err) {
                        res.status(500).json({ message: 'Serverside Error' })
                        throw err;
                    }
                });
            }
        }
        if (req.body.log != null && userIndex != null) {

            if (users[userIndex].log == null) {
                console.log("lg exists nicht");
                users[userIndex].log = []
            }
            users[userIndex].log.push(req.body.log)

            console.log("Log push" + req.body.log);
            

            fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                if (err) {
                    res.status(500).json({ message: 'Serverside Error' })
                    throw err;
                }
                console.log("Done writing"); // Success 
            });
        }
        res.status(200).json(users[userIndex]);
    } catch (err) {
        console.log(err);
        res.status(400).json({ message: err });

    }
});


router.delete('/:id', function (req, res) {
    for (var i = 0; i < users.length; i++) {
        if (users[i].id === req.params.id) {
            console.log(users[i]);
            users.splice(i, 1);
            fs.writeFile("/home/pi/Documents/htmlServer/data/users.json", JSON.stringify(users), err => {
                if (err) throw err;
                console.log("Done writing"); // Success 
            });
        }
    }
    res.status(200).send(users);

    /* tipps.splice(req.body.tippNumber, 1)
    fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
      if (err) throw err;
      console.log("Done writing");
    });*/
});

module.exports = router
