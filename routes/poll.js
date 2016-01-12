var express = require('express');
var router = express.Router();
var signup = require('./signup');
var ObjectId = require('mongodb').ObjectID;

router.get('/[a-z0-9]+',function(req,res,next){
	var poll=db.collection('poll');
	var theId=req.path.slice(1);
	var theUser=signup.get_user(req.cookies.username);
	poll.findOne({'_id':ObjectId(theId)},function(err,docs){
		if(!err){
			res.render('poll',{doc:docs,theUser:theUser});
		}
	});
});

router.post('/[a-z0-9]+',function(req,res,next){
	var poll=db.collection('poll');
	var theId=req.path.slice(1);
	var theUser=signup.get_user(req.cookies.username);
	if(theUser){
		var theOption=req.body.option;
		
		poll.findOne({'_id':ObjectId(theId)},function(err,docs){
			docs.options[theOption]++;
			docs.votedBy[theUser] && docs.options[docs.votedBy[theUser]]--;
			docs.votedBy[theUser]=theOption;
			poll.save(docs);
			res.redirect('/');
		});
		
	}
});

module.exports = {
	router : router
};