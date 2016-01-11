var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var secret = "XXXXXX";

function make_pw_hash(name, pw, salt){
	var h = crypto.createHash('sha256').update(name+pw+salt).digest("hex");
	return h+'|'+salt;
}

function valid_pw(name,pw,h){
	return h===make_pw_hash(name,pw,h.split('|')[1]);
}

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

/* GET home page. */
router.get('/', function(req, res, next) {
	var theUser=get_user(req.cookies.username);
	if(theUser){
		res.redirect("/");
	}
	else{
		res.render("login");
	}
});

//var user=db.collection('user');

router.post('/',function(req,res,next){
	username=req.body.username;
	password=req.body.password;
	var user=db.collection('user');
	user.findOne({'username':username},function(err,docs){
		var isValid= valid_pw(username,password,docs.password);
		if(isValid){
			res.cookie('username',make_secure_val(username),{path:'/'});
			res.redirect('/');
			//res.send('successful login '+username+' '+password+' '+docs.password);
		}
		else{
			res.render('login',{invalid:"Invalid login credentials"});
		}
	});
	/*
	if(username && password){
		res.send('wait');
	}
	else{
		res.render('index',{invalid:"Invalid login credentials"})
	}
	*/
});

module.exports = {
	router: router
};