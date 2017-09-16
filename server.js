const http = require('http');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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

app.use(bodyParser.json({
	limit : 10000
}));

app.get("/teacher1", function(req, res){
	res.sendFile('public/teacher1.html', {root: __dirname })
})

app.get("/teacher2", function(req, res){
	res.sendFile('public/teacher2.html', {root: __dirname })
})

app.get("/student", function(req, res){
	res.sendFile('public/student.html', {root: __dirname })
})

app.get("/", function(req, res){
	res.sendFile('public/index.html', {root: __dirname })
})

app.listen(3000)