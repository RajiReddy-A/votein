$('document').ready(function(){

  $('#logout').click(function() {
  	document.cookie="username=";
  	window.location="/login";
  });

  var optionNum = 3;

  $('.options').click(function() {
  	$('.addOptions').append("<input type='text' name='option"+optionNum+"' required><br>");
  	optionNum++;
  });
     
  var totalData = [];
  var polls = $('#forClient').val();
  polls = JSON.parse(polls);
  
  for (var poll in polls){
    var tempArray=[];
    for (var key in polls[poll].options){
      tempArray.push({
        value: polls[poll].options[key],
        label: key
      });
    }
    totalData.push(tempArray);
  }

/*
  var data = [
  {
    value: 20,
    color:"#878BB6"
  },
  {
    value : 40,
    color : "#4ACAB4"
  },
  {
    value : 10,
    color : "#FF8153"
  },
  {
    value : 30,
    color : "#FFEA88"
  }
];
*/
  var options = {
  segmentShowStroke : false,
  animateScale : true,
  //tooltipTemplate: "<%= label %>"
};
  // Get context with jQuery - using jQuery's .get() method.
  for(var i=0;i<totalData.length;i++){
    var tempID='myChart'+i;
    $('#theDiv'+i).append("<canvas id="+tempID+" width='100' height='100'></canvas>");
    $('#theDiv'+i).addClass('textChartRow');
    var ctx = $("#"+tempID).get(0).getContext("2d");
    // This will get the first returned node in the jQuery collection.
    //var myNewChart = new Chart(ctx);
    var myPieChart = new Chart(ctx).Pie(totalData[i],options);
    //generate legend
    //$('#js-legend'+0).html(myPieChart.generateLegend()); // = "testing"; //;
  }

});