var express = require('express');
var router = express.Router();
var signup = require('./signup');
var ObjectId = require('mongodb').ObjectID;

router.get('/[a-z0-9]+',function(req,res,next){
	var poll=db.collection('poll');
	var theId=req.path.slice(1);
	var theUser=signup.get_user(req.cookies.username);
	console.log(theUser);
	poll.findOne({'_id':ObjectId(theId)},function(err,docs){
		if(!err){
			res.render('poll',{doc:docs,theUser:theUser});
		}
	});
	//res.send('working');
});

router.post('/[a-z0-9]+',function(req,res,next){
	var poll=db.collection('poll');
	var theId=req.path.slice(1);
	var theUser=signup.get_user(req.cookies.username);
	if(theUser){
		var theOption=req.body.option;
		//var temp={'votedBy':{theUser:theOption}};//{'votedBy.'+theUser:theOption}
		console.log("the option is "+req.body.option);
		
		/*
		var temp='votedBy.'+theUser;
		var temp2={[temp]:theOption};
		
		poll.update({'_id':ObjectId(theId)},{ $set:{[temp]:theOption}, $inc: {['options'+'[votedBy.rrrr]']:1} });
		res.redirect('/');
		*/
		
		poll.findOne({'_id':ObjectId(theId)},function(err,docs){
			console.log('just before docs');
			console.log(docs);
			docs.options[theOption]++;
			docs.votedBy[theUser] && docs.options[docs.votedBy[theUser]]--;
			docs.votedBy[theUser]=theOption;
			console.log(docs);
			poll.save(docs);
			res.redirect('/');
		});
		
	}
});

module.exports = {
	router : router
};