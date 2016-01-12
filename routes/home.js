var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var signup = require('./signup');

router.get('/', function (req,res,next) {
	var theUser = signup.get_user(req.cookies.username);
	var poll=db.collection('poll');
	poll.find().sort({'date': -1}).toArray(function(err,docs){
		res.render("home",{polls:docs,stringifiedPolls:JSON.stringify(docs),theUser:theUser});
	});
});

router.post('/',function (req,res,next) {
	var theUser = signup.get_user(req.cookies.username);
	if(theUser){
		var title=req.body.title;
		var options={};
		for (var each in req.body){
			if(each != 'title'){
				options[req.body[each]]=0;
			}
		}
		var date=Date.now();
		var poll=db.collection('poll');
		poll.insert({
			'title':title,
			'options':options,
			'votedBy':{},
			'createdBy':theUser,
			'date':date
		},function(err,docs){
			res.redirect('/poll/'+docs.ops[0]._id.valueOf());
		});
	}
	else{
		res.redirect('/login');
	}

});

module.exports = {
	router : router
};