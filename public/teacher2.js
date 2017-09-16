
var students = {
    // A labels array that can contain any sort of values
    //labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    // Our series array that contains series objects or in this case series data arrays
      series: [
        [0]
    ]
};

var genNew = function(pt) {
	data.series[0].splice(0, 1)
	data.series[0].push(pt)
    return data;
}

function getDateName(){

  var d = new Date();
  var datestring =  ("0"+(d.getMonth()+1)).slice(-2) + "-"  +("0" + d.getDate()).slice(-2) + "-" +
    d.getFullYear();;

  return datestring;

}

function getDateAxis(){
  var d = new Date();
  return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) +":" + ("0" + d.getSeconds()).slice(-2)  ;
}

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.

var ctx = document.getElementById('chart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        datasets: [{
            label: "Student 1",
            fill: false,
            borderColor: 'rgb(200,69,0)',
            data: students.series[0]
        }]
    },

    // Configuration options go here
    options: {
      title: {
        display: true,
        position: "top",
        text: "Session " + getDateName()
      }
    }
});

var up = function() {
	$.get("/ajax/engagement", function(pt){
        var chartData = chart.data.datasets[0].data;
        chartData[chartData.length] = pt;
        chart.data.labels[chartData.length-1] = getDateAxis();
        chart.update();
      })
	}


setInterval(up, 3000)
