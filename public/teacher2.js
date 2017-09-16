
var data = {
    // A labels array that can contain any sort of values
    //labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    // Our series array that contains series objects or in this case series data arrays
    series: [
        [0,0,0,0,0,0,0,0,0,0,
         0,0,0,0,0,0,0,0,0,0,]
    ]
};

var genNew = function(pt) {
	data.series[0].splice(0, 1)
	data.series[0].push(pt)
    return data;
}

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
chart = new Chartist.Line('.ct-chart', data);

var up = function() {
	$.get("/ajax/engagement", function(pt){
    	chart.update(genNew(pt))
	})
}

setInterval(up, 3000)