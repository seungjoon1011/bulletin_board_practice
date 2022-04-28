const router = require('express').Router();
var db = require('../db.js');
var template = require(`../template.js`);
var fs = require('fs');
var http = require('http');
var qs = require('querystring');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', '../views');
console.log('global');

router.get('/:Id', function(req,res){
    console.log('globalid')
    db.query(`SELECT topic.id, title, description, topic.time, name FROM topic LEFT JOIN user ON topic.user_id=user.id`, function(error, topics){
        var pg = req.params.Id;
        res.render('homepage',{loging: template.CheckLogin(req,res), numOfpage: template.pageList(topics), topics: `${topics}`, pg: `${pg}`, list: template.list(topics,pg)});
    });
});

router.get('/', function(req,res){
    console.log('mainpage')
    db.query(`SELECT topic.id, title, description, topic.time, name FROM topic LEFT JOIN user ON topic.user_id=user.id`, function(error, topics){
        res.render('homepage',{loging: template.CheckLogin(req,res), numOfpage: template.pageList(topics), topics: `${topics}`, pg: '1', list: template.list(topics,1)});
    });
});

module.exports = router;