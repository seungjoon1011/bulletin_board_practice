const router = require('express').Router();
var db = require('../db.js');
var fs = require('fs');
var http = require('http');
var qs = require('querystring');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var cookie = require('cookie');
console.log('user');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', '../views');

router.get(`/login`, function(req,res){
    console.log('userlogin');
    res.render('user/login', {action: "/user/login_process", title: "login"});
})
//로그인,회원가입 창에 들어갔을때만 쿠키가 적용됨.//로그인이 가장 윗 것 밖에 안됨.
router.post(`/login_process`, function(req,res){
    console.log('uesrloginprocess');
    var post = req.body;
    var email = post.email;
    var password = post.password;
    var numOfuser=-1;
    db.query(`SELECT * FROM user`, function(err, users){
        console.log(users);
        for(let i = 0;i<users.length;i++){
            console.log(users.length);
            if(users[i].email == email){
                numOfuser = i;
                break;
            }
        }
        if(numOfuser == -1){//email다른지 확인
            res.send("<script>alert('email wrong!');location.href='http://localhost:3000/user/login'</script>");
        }else if(users[numOfuser].password == password){//password같은지 확인
            res.writeHead(302, {
                'Set-Cookie': [
                    `email=${email};Path=/`,//path 설정 안했더니 /user에 생성해서 homepage에는 쿠키가 적용되지 않았다.
                    
                ],
                Location: `/`
            });
        }else{
            res.send("<script>alert('password wrong!');location.href='http://localhost:3000/user/login'</script>");
        }
        res.end(); 
    })
})

//쿠키가 적용이 안됨.
router.post(`/logout_process`,function(req,res){
    console.log('userlogoutprocess');
    console.log('logout');
    res.writeHead(302, {
        'Set-Cookie': [
          `email=;Path=/; Max-Age=0`,
        ],
        Location: `/`
    });
    res.end();
})

router.get(`/create_account`, function(req,res){
    console.log('usercreateaccount');
    res.render('user/create_account', {title: 'create_account', action: '/user/create_process'});
});

router.post(`/create_process`, function(req, res){
    console.log('usercreateprocess');
    var post = req.body;
    var name = post.name.trim();//공백 제거
    var email = post.email.trim();
    var password = post.password.trim();
    if(name!=''&&email!=''&&password!=''){
        db.query(`INSERT INTO user (name, email, password) VALUES(?,?,?);`,[name,email,password],
            function(err, result){
                res.redirect(`/`);
        })
    }else{
        res.send("<script>alert('fill the blank!');location.href='http://localhost:3000/user/create_account'</script>");
    }
})

module.exports = router;