
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
var cors = require('cors');
var bodyParser = require('body-parser')

const tipps = require("/home/pi/Documents/htmlServer/data/tipps.json");

app.use(express.json({
  type: ['application/json', 'text/plain']
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(cors());
app.use(function (req, res, next) {
  res.header("X-Content-Type-Options", "bastianschmalbach.de");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

const usersRouter = require('./routes/users')
const challengesRouter = require('./routes/challenges')
app.use('/users', usersRouter)
app.use('/challenges', challengesRouter)


app.get('/', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/index.html');
});

app.get('/addTipps', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/addTipps.html');
});

app.get('/editTipps', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/editTipps.html');
});

app.get('/addChallenges', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/addChallenges.html');
});

app.get('/editChallenges', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/editChallenges.html');
});

app.get('/design', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/design.html');
});

app.get('/prototypes', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/prototypes.html');
});

app.get('/documentation', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/documentation.html');
});

app.get('/github', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/github.html');
});

app.get('/tipps', async function (req, res) {
  var filteredTipps = []
  try {
    if (req.query.minscore != null) {
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
    }

    /* if (req.query.category != null && req.query.minscore != null) {
      tipps.forEach(element => {
        if (element.category === req.query.category && element.score >= req.query.minscore) filteredTipps.unshift(element);
      })
    } 
    else if (req.query.maxscore != null) {
      tipps.forEach(element => {
        if (element.score <= req.query.maxscore) filteredTipps.unshift(element);
      })
    }
    else if (req.query.category != null) {
      tipps.forEach(element => {
        if (element.category === req.query.category) filteredTipps.unshift(element);
      })
    } */ 
    res.status(200).send(filteredTipps);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message : 'Serverside Error' });
  }
});

app.get('/tipps/:id', function (req, res) {
  var tipp = {};
  tipps.forEach(element => {
    if (element.id === req.params.id) tipp = element;
  })
  if (tipp.id != undefined) res.status(200).send(tipp);
  else res.status(404).json({ message : 'Tipp does not exist' });
});

app.post('/tipps', function (req, res) {
  tipps.unshift(req.body);
  fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
    if (err) {
      res.status(500).json({ message : 'Serverside Error' })
      throw err;
    }
    console.log("Done writing"); // Success 
  });
  res.status(201).json({ message: 'Post erfolgreich' } );
});

app.patch('/tipps/:id', function (req, res) {
  console.log("patch");
  
  for (var i = 0; i < tipps.length; i++) {
    if (tipps[i].id === req.params.id) {
      if (req.query.thumb === "down"){
        tipps[i].score -= 1
      }
      else if (req.query.thumb === "up"){
        tipps[i].score += 1
      }
      fs.writeFile("/home/pi/Documents/htmlServer/data/tipps.json", JSON.stringify(tipps), err => {
        if (err) throw err;
        console.log("Done writing"); // Success 
      });
    }
  }
  res.status(200).json({ message: 'Patch erfolgreich' } );
});

app.delete('/tipps/:id', function (req, res) {
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
  });*/
});

io.on('connection', (client) => {
  console.log('A client connected\t', client.id);
  client.on('disconnect', function () {
    console.log('A client disconnected\t', client.id);
  });
});

http.listen(9000, function () {
  console.log('listening on 192.168.2.128:9000');
});