
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
const fs = require('fs');
var cors = require('cors');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv/config')

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
const reportedTippsRouter = require('./routes/reportedTipps')
const usersRouter = require('./routes/users')
const feedbacksRouter = require('./routes/feedbacks')
const factsRouter = require('./routes/facts')
app.use('/tipps', tippsRouter)
app.use('/reportedTipps', reportedTippsRouter)
app.use('/users', usersRouter)
app.use('/feedbacks', feedbacksRouter)
app.use('/facts', factsRouter)


app.get('/', function (req, res) {
  res.sendFile('web-app/index.html', {root: __dirname});
});

app.get('/addTipps', function (req, res) {
  res.sendFile('web-app/addTipps.html', {root: __dirname});
});

app.get('/editTipps', function (req, res) {
  res.sendFile('web-app/editTipps.html', {root: __dirname});
});

app.get('/addChallenges', function (req, res) {
  res.sendFile('web-app/addChallenges.html', {root: __dirname});
});

app.get('/editChallenges', function (req, res) {
  res.sendFile('web-app/editChallenges.html', {root: __dirname});
});

app.get('/design', function (req, res) {
  res.sendFile('web-app/design.html', {root: __dirname});
});

app.get('/prototypes', function (req, res) {
  res.sendFile('web-app/prototypes.html', {root: __dirname});
});

app.get('/documentation', function (req, res) {
  res.sendFile('web-app/documentation.html', {root: __dirname});
});

app.get('/github', function (req, res) {
  res.sendFile('web-app/github.html', {root: __dirname});
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

/* io.on('connection', (client) => {
  console.log('A client connected\t', client.id);
  client.on('disconnect', function () {
    console.log('A client disconnected\t', client.id);
  });
}); */

const myPort = process.env.PORT || 9000
http.listen(myPort, function () {
  console.log('listening on 192.168.2.128:9000');
});