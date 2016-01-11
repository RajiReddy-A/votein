$('#logout').click(function() {
	document.cookie="username=";
	window.location="/login";
});

var optionNum = 3;

$('.options').click(function() {
	$('.addOptions').append("<input type='text' name='option"+optionNum+"' required><br>");
	optionNum++;
});