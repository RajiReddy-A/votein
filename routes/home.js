var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var secret = "XXXXXXX";

function make_secure_val(s){
	var h = crypto.createHash('sha256').update(s+secret).digest("hex");
	return s+'|'+h;
}

function check_secure_val(h){
	if(h){
		var s= h.split('|')[0];
		return h===make_secure_val(s);
	}
}

function get_user(h){
	if(check_secure_val(h)){
		return h.split('|')[0];
	}
}

router.get('/', function (req,res,next) {
	var theUser = get_user(req.cookies.username);
	var poll=db.collection('poll');
	poll.find().sort({'date': -1}).toArray(function(err,docs){
		console.log("before docs");
		console.log(docs);
		res.render("home",{polls:docs,theUser:theUser});
		console.log("check this");
	});
	//res.render("home",{theUser:theUser});
});

router.post('/',function (req,res,next) {
	var theUser = get_user(req.cookies.username);
	if(theUser){
		var title=req.body.title;
		var options={};
		console.log('check post');
		for (var each in req.body){
			if(each != 'title'){
				options[req.body[each]]=0;
				console.log(options);
			}
		}
		//var options=[req.body.option1,req.body.option2];
		var date=Date.now();
		var poll=db.collection('poll');
		poll.insert({
			'title':title,
			'options':options,
			'votedBy':{},
			'createdBy':theUser,
			'date':date
		},function(err,docs){
			res.send(docs);
		});
	}
	else{
		res.redirect('/login');
	}

});

module.exports = {
	router : router
};