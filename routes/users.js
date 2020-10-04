const express = require('express')
const router = express.Router()
const fs = require('fs');
const rfc6902 = require('rfc6902');
const User = require('../models/User')

//const users = require("/home/pi/Documents/htmlServer/data/users.json");


// Old Get
/* router.get('/', async function (req, res) {
    try {
        res.status(200).send(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Serverside Error' });
    }
}); */

router.get('/', async function (req, res) {
    try {
        const users = await User.find(req.query);
        res.status(200).json(users)
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Get ID
/* router.get('/:id', async function (req, res) {
    var user = await users.find(element => element.id == req.params.id)
    if (user != undefined) res.status(200).send(user);
    else res.status(404).json({ message: 'Tipp does not exist' });
}); */

router.get('/:id', async function (req, res) {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json(user)
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Post
/* router.post('/', async function (req, res) {
    var user = await users.find(element => element.id == req.body.id)
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
}); */

router.post('/', async function (req, res) {
    const user = new User({
        phoneId: req.body.phoneId,
        name: req.body.name,
        age: req.body.age,
        gender: req.body.gender,
        hideInfo: req.body.hideInfo
    });

    try {
        const user2 = await User.find( { phoneId: req.body.phoneId })
        if (user2[0] != undefined){
            res.status(200).json(user2[0])
        } else {
            const savedUser = await user.save()
            res.status(200).json(savedUser)
        }
    }
    catch (err) {
        res.status(404).json({ message: err })
    }
});

router.patch('/:id', async function (req, res) {
    try {
        const user = await User.findById(req.params.id);

        if (req.body.name != null) {
            user.name = req.body.name
        }
        if (req.body.reportedTipps != null) {
            if (user.reportedTipps == null) user.reportedTipps = 0;
            if (req.body.reportedTipps === "report") {
                user.reportedTipps += 1
            } else if (req.body.reportedTipps === "unreport") {
                user.reportedTipps -= 1
            }
        }
        if (req.body.hideInfo != null) {
            user.hideInfo = req.body.hideInfo
        }
        if (req.body.age != null) {
            user.age = req.body.age
        }
        if (req.body.gender != null) {
            user.gender = req.body.gender
        }
        if (req.body.checkedTipps != null) {
            var tippIndex = await user.checkedTipps.findIndex(element => element == req.body.checkedTipps)

            if (tippIndex > -1) {
                user.checkedTipps.splice(tippIndex, 1);
            } else if (tippIndex = -1) {
                user.checkedTipps.unshift(req.body.checkedTipps)
            }
        }
        if (req.body.savedTipps != null) {
            var tippIndex = await user.savedTipps.findIndex(element => element == req.body.savedTipps)
            
            if (tippIndex > -1) {
                user.savedTipps.splice(tippIndex, 1);
            } else if (tippIndex = -1) {
                user.savedTipps.unshift(req.body.savedTipps)
            }
        }
        if (req.body.log != null) {
            if (user.log == null) user.log = [];

            user.log.push(req.body.log)
        }
        user.save()
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

/* router.patch('/:id', async function (req, res) {

    var userIndex = await users.findIndex(element => element.id == req.params.id)

    if (userIndex > -1) {
        try {
            if (req.body.name != null) {
                users[userIndex].name = req.body.name
            }
            if (req.body.reportedTipps != null) {
                if (users[userIndex].reportedTipps == null) users[userIndex].reportedTipps = 0;
                if (req.body.reportedTipps === "report") {
                    users[userIndex].reportedTipps += 1
                } else if (req.body.reportedTipps === "unreport") {
                    users[userIndex].reportedTipps -= 1
                }
            }
            if (req.body.hideInfo != null) {
                users[userIndex].hideInfo = req.body.hideInfo
            }
            if (req.body.age != null) {
                users[userIndex].age = req.body.age
            }
            if (req.body.gender != null) {
                users[userIndex].gender = req.body.gender
            }
            if (req.body.checkedTipps != null) {
                var tippIndex = await users[userIndex].checkedTipps.findIndex(element => element == req.body.checkedTipps)

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
                var tippIndex = await users[userIndex].savedTipps.findIndex(element => element == req.body.checkedTipps)

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
                var tippIndex = await users[userIndex].checkedChallenges.findIndex(element => element == req.body.checkedTipps)

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
                var tippIndex = await users[userIndex].savedChallenges.findIndex(element => element == req.body.checkedTipps)

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
            res.status(200).json(users[userIndex]);
        } catch (err) {
            console.log(err);
            res.status(400).json({ message: err });

        }
    } else {
        res.status(404).json({ message: "User does not exist" });
    }
}); */

router.delete('/:id', async function (req, res) {
    try {
        const deletedUser = await User.deleteOne({_id: req.params.id})
        res.status(200).send(deletedUser);
    } catch (err) {
        res.status(404).json({ message: err })
    }
});

// Old Delete
/* router.delete('/:id', async function (req, res) {

    var i = await users.findIndex(element => element.id == req.params.id)

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
}); */

module.exports = router
