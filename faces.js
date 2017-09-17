// start project oxford 
var oxford = require('project-oxford');
//var client_face = new oxford.Client('0e44c5b59530422ca9d3c6597499689d');
var client_recognize = new oxford.Client('20e0adac0cc442bc8c86d27c0c2f956c');
// var client_getname = new oxford.Client('20e0adac0cc442bc8c86d27c0c2f956c');
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

const student_list = ['Mr. Yu','Miss Deng','Mr. Chuang','Miss Lin'];
const student_id_list = ['61ab3e26-3aa5-4f70-af61-70ff15fc2f47','4096990f-bc8d-4c77-9bb0-80b2bfe372a2','066d230e-36bd-4905-9c0b-c639e8c308e2','c8a0a3f6-5497-4eb5-979c-18e8af5499dc']

var Faces = {
    calc_confusion: function(img_path, cb) {
        console.log("calc confusion start")
        client_emotion.emotion.analyzeEmotion({
            path: img_path,
        }).then(function(response) {
<<<<<<< HEAD
=======
            var confusion_sum = 0;
>>>>>>> master
            console.log("calc confusion cb")
            // iterate over all faces in the image
            console.log("")
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
<<<<<<< HEAD
                // engagement of the student
                var confusion = s * Math.tanh(c * ((distance_e - distance_ue))) + s / 2;
                console.log("Your confusion level is:" + confusion);
                cb(confusion);
=======

                // confusion of the student
                var confusion = s/2 - s * Math.tanh(c * distance_ue);
                console.log("The confusion level of the current student is:" + confusion);
                confusion_sum += confusion
>>>>>>> master
            }
            cb(confusion_sum / response.length);            
        });
    },

    calc_distraction: function(img_path, num_students, cb){
        console.log('calc distraction start');
        client_recognize.face.detect({
            path: img_path,
            analyzesHeadPose: true,
            returnFaceId: true
        }).then(function(response){
            console.log("Response Length: " + response.length);
            var faceId_arr = []
            for (var j = 0; j < response.length; j++){
                faceId_arr.push(response[j].faceId)
                console.log("Face Id: " + response[j].faceId);
            }
            client_recognize.face.identify(
               faceId_arr,
               'student'    
            ).then(function(response){
                // console.log(response[0]);             
                for (var j = 0; j < response.length; j++){
                    // get name of each face
                    var personId = response[j].candidates[0].personId;
                    console.log("the id of this unknown person is " + personId);
                    // get name of person
                    var found_person = false;
                    for (var ct = 0; ct < student_id_list.length; ct++){
                        if (student_id_list[ct] == personId){
                            console.log("Found person: " + student_list[ct]);
                            found_person = true;
                        }
                    }
                    if (!found_person){
                        console.log("Cannot find this person in our database.");
                    }
                    // client_recognize.face.person.get(
                    //     'student', 
                    //     personId
                    //     ).then(function(response){
                    //        console.log("Found person id: " + response[0].candidates[0].personId);
                    // })
                }
            })
            console.log('calc distraction cb')
            var sum_distraction = 0;
            if (response.length < num_students) {
                // account for students that are not detected by the API
                sum_distraction += 10*(num_students - response.length);
            } else{ 
                //iterate over all faces detected
                for (var j = 0; j < response.length; j++){
                    var h_yaw = Math.abs(response[j].faceAttributes.headPose.yaw)/50
                    var h_pitch = Math.abs(response[j].faceAttributes.headPose.pitch)/50
                    var h_roll = Math.abs(response[j].faceAttributes.headPose.roll)/50
                    var distance = h_yaw * h_yaw + h_pitch * h_pitch + h_roll * h_roll;
                    sum_distraction += s * Math.tanh(c * ((distance)))+ s / 2;   
                }
            }
            var distraction = sum_distraction / num_students;
            console.log("The class's distraction level is " + distraction);
            cb(distraction);
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