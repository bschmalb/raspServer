var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
var cors = require('cors');
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended : true}));
app.use(cors());
app.use(function(req, res, next) {
  res.header("X-Content-Type-Options", "bastianschmalbach.de");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/index.html');
});

app.get('/addTipps', function (req, res) {
  res.sendFile('/home/pi/Documents/htmlServer/web-app/addTipps.html');
});

app.get('/tipps', function (req, res) {
  fs.readFile('data/tipps.json', (err, data) => {
    if (err) throw err;
    let tipps = JSON.parse(data);
    res.status(200).send(JSON.stringify(tipps))
  });
});

app.post('/tipps', function (req, res) {
    console.log(req.body);
    
    fs.readFile('data/tipps.json', (err, data) => {
      if (err) throw err;
      let tipps = JSON.parse(data);
      //console.log(tipps);
    });
    
    //tipps.push(tipp);

    res.send('Der Tipp wurde erfolgreich hinzugefügt');
});

app.get('/challenges', function (req, res) {
  fs.readFile('data/challenges.json', (err, data) => {
    if (err) throw err;
    let challenges = JSON.parse(data);
    res.status(200).send(JSON.stringify(challenges))
  });
});

function getTipps() {
  fs.readFile('data/tipps.json', (err, data) => {
    if (err) throw err;
    let tipps = JSON.parse(data);
    return tipps;
  });
}

io.on('connection', (client) => {
  console.log('A client connected\t', client.id);
  client.on('disconnect', function () {
    console.log('A client disconnected\t', client.id);
  });
});

http.listen(9000, function () {
  console.log('listening on 192.168.2.128:9000');
});