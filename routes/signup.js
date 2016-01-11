var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var secret="XXXXX";

function validCheck (exp,name) {
	return exp.test(name);
}

function make_salt(){
	salt="";
	var x="abcdefghijklmnopqrstuvwxyz";
	for (var i = 0; i < 5; i++) {
		salt+=x[Math.floor(Math.random() * 26)];
	}
	return salt;
}

function make_pw_hash(name, pw){
	var salt=make_salt();
	var h = crypto.createHash('sha256').update(name+pw+salt).digest("hex");
	return h+'|'+salt;
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
		res.render('signup');
	}
});

router.post('/',function(req,res,next){
		username=req.body.username;
		password=req.body.password;
		verify=req.body.verify;
		email=req.body.email;
		userCheck=validCheck(/^[a-zA-Z0-9_-]{3,20}$/,username);
		passCheck=validCheck(/^.{3,20}$/,password);
		emailCheck=validCheck(/^[\S]+@[\S]+\.[\S]+$/,email);
		var user=db.collection('user');
		
		if(userCheck && password===verify && passCheck && (!email || emailCheck)){
			
			user.findOne({'username':username},function(err,docs){
				console.log(docs);
				if(docs){
					res.render('signup',{username:username,email:email,invalidName:'username already exists'});
				}
				else{
					user.insert({
						'username':username,
						'password':make_pw_hash(username,password),
						'email':email
					},function(err,docs){
						res.cookie('username',make_secure_val(username),{path:'/'});
						res.redirect('/');
						//res.send("welcome, "+username+"!");
					});
				}
			});
		}
		else{
			var invalidName=(userCheck ? "" : "Invalid Username");
			var invalidPass=(passCheck ? "" : "Invalid Password");
			var invalidVerify=(invalidPass ? "" : (password===verify ? "" : "Passwords did not match"));
			var invalidEmail=((!email || emailCheck) ? "" : "Invalid email");
			res.render('signup',{username:username,email:email,invalidName:invalidName,invalidPass:invalidPass,invalidVerify:invalidVerify,invalidEmail:invalidEmail});
		}
});

module.exports = {
	router : router,
	get_user: get_user
};