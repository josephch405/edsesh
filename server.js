const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path')
var multer  = require('multer')
var crypto = require('crypto')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './img/')
  },
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      cb(null, Date.now() + '.png');
    });
  }
});

var upload = multer({ storage: storage })
// import initializeDb from './db';
// import middleware from './middleware';
// import api from './api';
// import config from './config.json';

let app = express();
app.server = http.createServer(app);

// logger
// app.use(morgan('dev'));

// 3rd party middleware
// app.use(cors({
// 	exposedHeaders: config.corsHeaders
// }));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get("/teacher1", function(req, res){
	res.sendFile('public/teacher1.html', {root: __dirname })
})

app.get("/teacher2", function(req, res){
	res.sendFile('public/teacher2.html', {root: __dirname })
})

app.get("/ajax/engagement", function(req,res){
	res.send(200, Math.random() * 5)
})

app.post('/img', upload.single('pic'), function (req, res, next) {
   console.log(req.file)
   console.log(req.body)
   res.send("done");
});

app.post('/help', function(req,res){
	//console.log(req.body)
	res.send("")
});

app.get("/student", function(req, res){
	res.sendFile('public/student.html', {root: __dirname })
})

app.get("/", function(req, res){
	res.sendFile('public/index.html', {root: __dirname })
})

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000)
