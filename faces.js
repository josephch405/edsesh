// start project oxford 
var oxford = require('project-oxford');
var client_face = new oxford.Client('20e0adac0cc442bc8c86d27c0c2f956c');
var client_emotion = new oxford.Client('f459d95e5a634e2b8536c48f2e82e41c');

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

var Faces = {
    faceTest: function() {
        // detect face
        client_face.face.detect({
            path: 'oba.jpg',
            analyzesAge: true,
            analyzesGender: true,
            analyzesHeadPose: true
        }).then(function(response) {
            console.log(response);
        });
    },
    calc_attention: function(img_path) {
        client_emotion.emotion.analyzeEmotion({
            path: img_path,
        }).then(function(response) {
            // iterate over all faces in the image
            for (var j = 0; j < response.length; j++) {
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
                var distance_e = diff_e_anger * diff_e_anger + diff_e_contempt * diff_e_contempt +
                    diff_e_disgust * diff_e_disgust + diff_e_fear * diff_e_fear +
                    diff_e_happiness * diff_e_happiness + diff_e_neutral * diff_e_neutral +
                    diff_e_sadness * diff_e_sadness + diff_e_surprise * diff_e_surprise;
                var distance_ue = diff_ue_anger * diff_ue_anger + diff_ue_contempt * diff_ue_contempt +
                    diff_ue_disgust * diff_ue_disgust + diff_ue_fear * diff_ue_fear +
                    diff_ue_happiness * diff_ue_happiness + diff_ue_neutral * diff_ue_neutral +
                    diff_ue_sadness * diff_ue_sadness + diff_ue_surprise * diff_ue_surprise;

                var engagement = s * Math.tanh(c * ((distance_e - distance_ue))) + s / 2;

                console.log("Your attention level is:" + engagement);
            }
        });
    },
    prepare_emotion_data: function() {
        var writer = csvWriter({
            headers: ["img", "anger", "contempt", "disgust", "fear", "happiness", "neutral", "sadness", "surprise"]
        })
        var img_path = 'imgs/engaged-students/';
        writer.pipe(fs.createWriteStream('out_engaged.csv'));
        for (var i = 0; i < 6; i++) {
            runImage(i, img_path, writer);
        }
    },
    // send a POST request to the api to get emotion data on a particular
    // image of name "img-[i].jpg"
    runImage: function(i, img_path, writer) {
        var img = img_path + 'img-' + (i > 9 ? "" + i : "0" + i) + '.jpg';
        client_emotion.emotion.analyzeEmotion({
            path: img,
        }).then(function(response) {
            for (var j = 0; j < response.length; j++) {
                var val_anger = response[j].scores.anger;
                var val_contempt = response[j].scores.contempt;
                var val_disgust = response[j].scores.disgust;
                var val_fear = response[j].scores.fear;
                var val_happiness = response[j].scores.happiness;
                var val_neutral = response[j].scores.neutral;
                var val_sadness = response[j].scores.sadness;
                var val_surprise = response[j].scores.surprise;
                writer.write([i + "-" + j, val_anger, val_contempt, val_disgust,
                    val_fear, val_happiness, val_neutral,
                    val_sadness, val_surprise
                ])
            }
        });
    }
}


module.exports = Faces;