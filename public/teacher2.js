var students = {
    series: [
        [0],
        [0]
    ]
};

var genNew = function(pt) {
    data.series[0].splice(0, 1)
    data.series[0].push(pt)
    return data;
}

function getDateName() {

    var d = new Date();
    var datestring = ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + "-" +
        d.getFullYear();;

    return datestring;

}

function getDateAxis() {
    var d = new Date();
    return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);
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
            label: "Distraction",
            fill: false,
            borderColor: 'rgb(255,165,0)',
            data: students.series[0]
        }, {
            label: "Confusion",
            fill: false,
            borderColor: 'rgb(160,32,240)',
            data: students.series[1]
        }]
    },

    // Configuration options go here
    options: {
        title: {
            display: true,
            position: "top",
            text: "Session " + getDateName()
        },
        scales:{
          xAxes:[{
            ticks:{
              maxTicksLimit:8
            }
          }]
        }
    }
});

var up = function() {
    $.get("/ajax/distraction", function(pt) {
        var chartData = chart.data.datasets[0].data;
        chartData[chartData.length] = pt;
        chart.data.labels[chartData.length-1] = getDateAxis();
        chart.update();
    })
    $.get("/ajax/confusion", function(pt) {
        var chartData = chart.data.datasets[1].data;
        chartData[chartData.length] = pt;
        chart.data.labels[chartData.length-1] = getDateAxis();
        chart.update();
    })
}

setInterval(up, 1000)

var checkHelp = function() {
    $.get("/checkHelp", function(list) {
        $("#helpbox").html("")
        for(var i in list){
            $("#helpbox").append("<div class = 'hbox hbox-" + list[i] + "'></div>")
        }
        console.log(list)
    })
}

setInterval(checkHelp, 1000)

function on() {
    document.getElementById("overlay").style.display = "block";
}

function off() {
    document.getElementById("overlay").style.display = "none";
    $.ajax({
      type: "POST",
      url: "nextSlide",
      data: 0
    });
}
