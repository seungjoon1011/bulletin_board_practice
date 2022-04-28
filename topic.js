const router = require('express').Router();
var db = require('../db.js');
var template = require(`../template.js`);
var fs = require('fs');
var http = require('http');
var qs = require('querystring');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var cookie = require('cookie');
console.log('topic');
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', '../views');


var loging = false;

router.get('/create', function(req,res){
    console.log('topiccreate');
    console.log('yes');
    loging = template.CheckLogin(req,res);
    if(loging){
       res.render('topic/create_topic',{title:'create', action:'/topic/create_process'});
    }else{
        res.redirect(404);
    }
});


router.get(`/:pageId`, function(req,res){
    console.log('topic.pageid');
    var Id = req.params.pageId;
    var cookies ={};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }
    db.query(`SELECT topic.id, title, description, topic.time,user_id, name FROM topic LEFT JOIN user ON topic.user_id=user.id WHERE topic.id=?`,[Id],function(error2,topic){
        var title = topic[0].title;
        var description = topic[0].description;
        loging = template.CheckLogin(req,res);
        if(loging){
            db.query(`SELECT * FROM user WHERE email =?`,[cookies.email],function(err,user){
                res.render('topic/view_pages', {Id: `${Id}`, title: `${title}`, description: `${description}`,topic_user_id: `${topic[0].user_id}`, user_id: `${user[0].id}`, time: `${topic[0].time}`, author: `${topic[0].name}`});
            });  

        }else{
            res.render('topic/view_pages',{Id: `${Id}`, title: `${title}`, description: `${description}`,topic_user_id: undefined, user_id: undefined, time: `${topic[0].time}`, author: `${topic[0].name}`});
        }                
    })
})
router.post("/create_process", function(req,res){
    console.log('topiccreateprocess');
    var post = req.body;
    var cookies = {};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }

    var title = post.title.trim();
    var description = post.description.trim();
    if(title==''||description==''){
        res.send("<script>alert('fill the blank!');location.href='http://localhost:3000/create'</script>");
    }
    else{db.query(`SELECT * FROM user WHERE email=?`,[cookies.email],function(err,user){
            db.query(`INSERT INTO topic (title, description, user_id) VALUES(?, ?, ?);`,
            [title, description, user[0].id],
            function(err, result){
                res.redirect(`/topic/${result.insertId}`);
            })
        })
    }
});

router.get(`/update/:Id`, function(req,res){
    console.log('topicupdate');
    var Id = req.params.Id;
    db.query(`SELECT * FROM topic WHERE id = ?`,[Id], function(err, topic){
        res.render('topic/update_topic', {title: 'update', action: `/topic/update_process/${Id}`, topicTitle: `${topic[0].title}`,topicDescription: `${topic[0].description}`, Id: `${Id}`})
    })
})

router.post(`/update_process/:Id`, function(req, res){
    console.log('topicupdateprocess');
    var Id = req.params.Id;
    var post = req.body;
    var title = post.title.trim();
    var description = post.description.trim();
    if(title==''||description==''){
        res.send(`<script>alert('fill the blank!');location.href="http://localhost:3000/update/${Id}"</script>`);
    }else{
        db.query(`UPDATE topic SET title=?, description=? WHERE id=?`,[title, description,Id], function(err,result){
            res.redirect(`/topic/${Id}`);
        })
    }
})

router.post(`/delete_process`, function(req, res){
    console.log('topicdeleteprocess');
    var post = req.body;
    db.query(`DELETE FROM topic WHERE id = ?`,[post.id],function(err,result){
        res.redirect(`/`);
    })
})

module.exports = router;