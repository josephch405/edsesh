const mongoose = require('mongoose')

//replace this nonsense
var uri = "mongodb://admin:admin@ds139954.mlab.com:39954/edusession";

mongoose.connect(uri)
var db = mongoose.connection;

var emotionSchema = mongoose.Schema({
  session: Number,
  confusion: [{date: Date, level: Number}],
  distraction: [{date: Date, level: Number}]
});

var Emotions = mongoose.model('Emotions', emotionSchema);

module.exports = Emotions;
