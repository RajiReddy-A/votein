var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var signup = require('./signup');

function valid_pw(name,pw,h){
	return h===signup.make_pw_hash(name,pw,h.split('|')[1]);
}

/* GET home page. */
router.get('/', function(req, res, next) {
	var theUser=signup.get_user(req.cookies.username);
	if(theUser){
		res.redirect("/");
	}
	else{
		res.render("login");
	}
});

router.post('/',function(req,res,next){
	username=req.body.username;
	password=req.body.password;
	var user=db.collection('user');
	//console.log('before req.body');
	//console.log(req.body);
	//console.log(req.body.password);
	user.findOne({'username':username},function(err,docs){
		//console.log(docs);
		var storedPass='';
		if(docs){
			storedPass=docs.password;
		}
		var isValid= valid_pw(username,password,storedPass);
		if(isValid){
			res.cookie('username',signup.make_secure_val(username),{path:'/'});
			res.redirect('/');
		}
		else{
			res.render('login',{invalid:"Invalid login credentials"});
		}
	});
});

module.exports = {
	router: router
};