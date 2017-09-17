const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-write-stream');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer')

const Faces = require('./faces')

const Emotions = require('./db')

// FILESYSTEM INITIALIZATION
var dir = './img';
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const directory = 'img';

fs.readdir(directory, (err, files) => {
    if (err) throw error;

    for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
            if (err) throw error;
        });
    }
});

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './img/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '.jpg');
    }
});

// END OF FILESYSTEM STUFF

var engagement = 0;
var sessionNumber = 0;
var icRoster = {};
var helpRoster = {};
var confusion = 0;
var distraction = 0;

var upload = multer({ storage: storage })


let app = express();
app.server = http.createServer(app);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get("/teacher1", function(req, res) {
    sessionNumber = new Date().getTime();
    var s = new Emotions({
        session: sessionNumber,
        confusion: [],
        distraction: []
    });
    s.save(function() {
        res.sendFile('public/teacher1.html', { root: __dirname })
    });
})

app.get("/teacher2", function(req, res) {
    res.sendFile('public/teacher2.html', { root: __dirname })
})

app.get("/teacher3", function(req, res) {
    res.sendFile('public/teacher3.html', { root: __dirname })
})

app.get("/getData", function(req, res) {
    Emotions.find({}, function(err, sessions) {
        var seshList = []
        for (var i in sessions) {
            seshList.push(sessions[i].session)
        }
        res.send(200, seshList)
    })
})

app.get("/ajax/confusion", function(req, res) {
    res.send(200, confusion)

})

app.get("/ajax/distraction", function(req, res) {
    res.send(200, distraction)
})

function updateEngagement(v) {
    engagement = v;
}

app.post('/img', upload.single('pic'), function(req, res, next) {
    //Faces.calc_attention("img/1505574244769.jpg")// + req.file.filename)
    Faces.calc_confusion("img/" + req.file.filename, updateConfusion)
    Faces.calc_distraction("img/" + req.file.filename, updateDistraction)
    var s = Emotions.findOne({ session: sessionNumber }, function(err, emotion) {
        console.log(emotion)
        if(emotion){
            emotion.confusion.push({ date: Date.now(), level: confusion })
            emotion.distraction.push({ date: Date.now(), level: distraction })
            emotion.save()
        }
    })
    res.send("done");
});


function updateConfusion(v) {
    confusion = confusion / 2 + v / 2;
}

function updateDistraction(v) {
    distraction = distraction / 2 + v / 2;
}

app.post("/nextSlide", function(req, res) {
    helpRoster = {};
    res.send("sent");
})

app.post("/getChartData", function(req, res) {
    //console.log(req.body.data)
    Emotions.findOne({ 'session': req.body.session }, function(err, sessions) {
        //  console.log(sessions)
        //  console.log(sessions.confusion)
        //console.log([sessions.confusion, sessions.distraction])
        res.send(200, [sessions.distraction, sessions.confusion])
    })
})


app.post('/ic', function(req, res) {
    icRoster[req.body.userId] = req.body.n;
})

app.post('/help', function(req, res) {
    helpRoster[req.body.userId] = 10;
    res.send(200);
});

function distillRoster() {
    var a = [];
    for (var i in helpRoster) {
        a.push(helpRoster[i])
    }
    a.sort(function(a, b) { return b - a });
    return a;
}

app.get('/checkHelp', function(req, res) {
    var newRoster = {};
    for (var i in helpRoster) {
        if (helpRoster[i] > 0)
            newRoster[i] = helpRoster[i] - 1
    }
    helpRoster = newRoster
    res.send(distillRoster());
})

app.post('/ic', function(req, res) {
    icRoster[req.body.userId] = req.body.n;
})

app.get('/ic/list', function(req, res) {
    var c = [0, 0, 0, 0];
    for (var p in icRoster) {
        c[icRoster[p]] += 1;
    }
    res.send(c)
})

app.get('/ic/new', function(req, res) {
    icRoster = {};
    res.send([0, 0, 0, 0])
})

app.get("/student", function(req, res) {
    res.sendFile('public/student.html', { root: __dirname })
})

app.get("/", function(req, res) {
    res.sendFile('public/index.html', { root: __dirname })
})

app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 3000)