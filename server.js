
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
var cors = require('cors');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config')

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

const tippsRouter = require('./routes/tipps')
const usersRouter = require('./routes/users')
const challengesRouter = require('./routes/challenges')
const factsRouter = require('./routes/facts')
app.use('/tipps', tippsRouter)
app.use('/users', usersRouter)
app.use('/challenges', challengesRouter)
app.use('/facts', factsRouter)


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

mongoose.connect(
  process.env.DB_CONNECTION, 
  {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
  console.log(`DB Connection Error: ${err.message}`);
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