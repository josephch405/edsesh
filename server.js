const http = require('http');
const express = require('express');
const fs = require('fs');
const csvWriter = require('csv-write-stream');
const cors = require('cors');
const bodyParser = require('body-parser');

const path = require('path')
const multer  = require('multer')
const crypto = require('crypto')

const Faces = require('./faces')

const Emotions = require('./db')

var dir = './img';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, Date.now() + '.jpg');
    });
  }
});

var engagement = 0;
var sessionNumber = 0;
var icRoster = {};
var helpRequests = false;
var helpctr = 0;

var confusion = 0;
var distraction = 0;

var upload = multer({ storage: storage })


let app = express();
app.server = http.createServer(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get("/teacher1", function(req, res){
  sessionNumber = new Date().getTime();
  var s = new Emotions({
    session: sessionNumber,
    confusion: [],
    distraction: []
  });
  s.save(function(){
    res.sendFile('public/teacher1.html', {root: __dirname })
  });
})

app.get("/teacher2", function(req, res){
	res.sendFile('public/teacher2.html', {root: __dirname })
})

app.get("/teacher3", function(req, res){
  var sessions = Emotions.distinct("session")
  console.log(sessions)
	res.sendFile('public/teacher3.html', {root: __dirname })
})

app.get("/ajax/confusion", function(req,res){
	res.send(200, confusion)
})

app.get("/ajax/distraction", function(req,res){
	res.send(200, distraction)
})


function updateEngagement(v){
	engagement = v;
}

app.post('/img', upload.single('pic'), function (req, res, next) {
   //Faces.calc_attention("img/1505574244769.jpg")// + req.file.filename)
   Faces.calc_confusion("img/" + req.file.filename, updateConfusion)
   Faces.calc_distraction("img/" + req.file.filename, 2, updateDistraction)
   var s = Emotions.findOne({session: sessionNumber}, function(err, emotion){
     console.log(emotion)
     emotion.confusion.push({date: Date.now(), level: 1})
     emotion.distraction.push({date: Date.now(), level: 2})
     emotion.save()
   })
   res.send("done");
});

function updateConfusion(v){
	confusion = v;
}

function updateDistraction(v){
	distraction = v;
}

app.post("/nextSlide", function(req,res){
  helpctr = 0;
  res.send("sent");
})

app.post('/help', function(req,res){
	//console.log(req.body)
  helpctr +=1;
	res.send("HELP");
});


app.get('/checkHelp', function (req,res){
  if (helpctr >= 2){
    res.send(true)
  }
  else{
    res.send(false)
  }
})

/*
app.get('/checkHelp', function (req,res){
  if (helpRequests){
    helpRequests = false;
    res.send(true)
  }
  else{
    res.send(false)
  }
}) */

app.post('/ic', function(req, res){
	icRoster[req.body.userId] = req.body.n;
})

app.get('/ic/list', function(req, res){
	var c = [0, 0, 0, 0];
	for(var p in icRoster){
		c[icRoster[p]] += 1;
	}
	res.send(c)
})

app.get('/ic/new', function(req, res){
	icRoster = {};
	res.send([0, 0, 0, 0])
})

app.get("/student", function(req, res){
	res.sendFile('public/student.html', {root: __dirname })
})

app.get("/", function(req, res){
	res.sendFile('public/index.html', {root: __dirname })
})

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000)
