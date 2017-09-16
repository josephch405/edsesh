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

var upload = multer({ storage: storage })

<<<<<<< HEAD
// means of engaged students
const m_e_anger = 0.001266617;
const m_e_contempt = 0.002459111;
const m_e_disgust = 0.000861581;
const m_e_fear = 6.30323E-06;
const m_e_happiness = 0.014181573;
const m_e_neutral = 0.968198226;
const m_e_sadness = 0.014857509;
const m_e_surprise = 7.24111E-05;
// means of un-engaged students
const m_ue_anger = 0.0023285;
const m_ue_contempt = 0.16141664;
const m_ue_disgust = 0.001194799;
const m_ue_fear = 0.000867736;
const m_ue_happiness = 0.026322898;
const m_ue_neutral = 0.931748261;
const m_ue_sadness = 0.014434198;
const m_ue_surprise = 0.00696194;
// parameters in formula for calculating engagement level
const s = 10
const c = 5

// start project oxford 
var oxford = require('project-oxford');
var client_face = new oxford.Client('20e0adac0cc442bc8c86d27c0c2f956c');
var client_emotion = new oxford.Client('f459d95e5a634e2b8536c48f2e82e41c');

// detect face

client_face.face.detect({
	path: img_path + 10 + '.jpg',
	analyzesHeadPose: true
}).then (function (response){
	calc_attention(response)
});

var calc_attention = function(response){
	if (response.length == 0) {
		console.log('Sleeping!');
	} else{ 
	for (var j = 0; j < response.length; j++){
		var h_yaw = Math.abs(response[j].faceAttributes.headPose.yaw)
		var h_pitch = Math.abs(response[j].faceAttributes.headPose.pitch)
		var h_roll = Math.abs(response[j].faceAttributes.headPose.roll)
		var distance = 0;
		if (h_yaw > 10) {
			distance = distance + math.square((h_yaw - 10));
		}
		if (h_pitch > 10) {
			distance = distance + math.square((h_pitch - 10));
		}
		if (h_roll > 10) {
			distance = distance + math.square((h_roll));
		}
		var val_distraction =  
		console.log(h_yaw + ', ' + h_pitch + ', ' + h_roll);
		// var distance = h_yaw * h_yaw + h_pitch * h_pitch + h_roll * h_roll
		// var att_value = 10 - 10*Math.tanh(0.1*distance)
		// console.log('Your attention value is ' + att_value);
	}}
}

var getHeadPose = function(img_path){
	console.log(img_path)
	client_face.face.detect({
		path: img_path,
		analyzesAge: true,
		analyzesGender: true,
		analyzesHeadPose: true
	}).then(function (response) {
		for (j = 0; j < response.length; j++){
			console.log(response[j].faceAttributes.headPose);
		}
	});
}

// getHeadPose("1.jpg")
// getHeadPose("2.jpg")
// getHeadPose("3.jpg")
// getHeadPose("4.jpg")
getHeadPose("5.jpg")

// calculate attention level
var calc_attention = function(img_path){
	client_emotion.emotion.analyzeEmotion({
		path: img_path,
	}).then(function (response) {
		// iterate over all faces in the image
		for (var j = 0; j < response.length; j++){
			// diff with mean of engaged student data
			var diff_e_anger = response[j].scores.anger - m_e_anger;
			var diff_e_contempt = response[j].scores.contempt - m_e_contempt;
			var diff_e_disgust = response[j].scores.disgust - m_e_disgust;
			var diff_e_fear = response[j].scores.fear - m_e_fear;
			var diff_e_happiness = response[j].scores.happiness - m_e_happiness;
			var diff_e_neutral = response[j].scores.neutral - m_e_neutral;
			var diff_e_sadness = response[j].scores.sadness - m_e_sadness;
			var diff_e_surprise = response[j].scores.surprise - m_e_surprise;
			
			// diff with mean of un-engaged student data
			var diff_ue_anger = response[j].scores.anger - m_ue_anger;
			var diff_ue_contempt = response[j].scores.contempt - m_ue_contempt;
			var diff_ue_disgust = response[j].scores.disgust - m_ue_disgust;
			var diff_ue_fear = response[j].scores.fear - m_ue_fear;
			var diff_ue_happiness = response[j].scores.happiness - m_ue_happiness;
			var diff_ue_neutral = response[j].scores.neutral - m_ue_neutral;
			var diff_ue_sadness = response[j].scores.sadness - m_ue_sadness;
			var diff_ue_surprise = response[j].scores.surprise - m_ue_surprise;
			
			// sum of squares
			var distance_e = diff_e_anger * diff_e_anger + diff_e_contempt * diff_e_contempt
			 + diff_e_disgust * diff_e_disgust + diff_e_fear * diff_e_fear
			 + diff_e_happiness * diff_e_happiness + diff_e_neutral * diff_e_neutral
			 + diff_e_sadness * diff_e_sadness + diff_e_surprise * diff_e_surprise;
			var distance_ue = diff_ue_anger * diff_ue_anger + diff_ue_contempt * diff_ue_contempt
			 + diff_ue_disgust * diff_ue_disgust + diff_ue_fear * diff_ue_fear
			 + diff_ue_happiness * diff_ue_happiness + diff_ue_neutral * diff_ue_neutral
			 + diff_ue_sadness * diff_ue_sadness + diff_ue_surprise * diff_ue_surprise;
			
			var engagement = s * Math.tanh(c * ((distance_e - distance_ue))) + s/2;
			
			console.log("Your attention level is:" + engagement);
		}
	});
}
=======
let app = express();
app.server = http.createServer(app);
>>>>>>> master

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

Faces.calc_attention("imgs/confused-students/img-02.jpg")

app.get("/teacher1", function(req, res){
	res.sendFile('public/teacher1.html', {root: __dirname })
})

app.get("/teacher2", function(req, res){
	res.sendFile('public/teacher2.html', {root: __dirname })
})

app.get("/ajax/engagement", function(req,res){
	res.send(200, engagement)
})

app.post('/img', upload.single('pic'), function (req, res, next) {
   //Faces.calc_attention("img/1505574244769.jpg")// + req.file.filename)
   Faces.calc_attention("img/" + req.file.filename, updateEngagement)

   res.send("done");
});

function updateEngagement(v){
	engagement = v;
}

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
