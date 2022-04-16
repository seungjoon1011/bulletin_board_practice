var fs = require('fs');
var http = require('http');
var qs = require('querystring');
var db = require('./db.js');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var cookie = require('cookie');
var template = require(`./template.js`);

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', './views');

var loging = false;

function CheckLogin(req, res){
    var loging = false;
    var cookies = {};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }
    console.log(cookies.email);
    if(cookies.email ==undefined){
        loging = false;
    }else{
        loging = true;
    }
    console.log(loging);
    return loging;
}
var authUI =``;
var authUI2 =``;
app.get(`/login`, function(req,res){
    res.render('login', {action: "/login_process", title: "login"});
})
app.post(`/login_process`, function(req,res){
    var post = req.body;
    var email = post.email;
    var password = post.password;
    db.query(`SELECT * FROM user`, function(err, users){
        for(let i = 0;i<users.length;i++){
            console.log(users[i].email,users[i].password);
            if(users[i].email == email){
                if(users[i].password == password){
                    res.writeHead(302, {
                        'Set-Cookie': [
                          `email=${email}`,
                        ],
                        Location: `/`
                    });
                }else{
                    res.send("<script>alert('password wrong!');location.href='http://localhost:3000/login'</script>");
                }
            }else{
                res.send("<script>alert('email wrong!');location.href='http://localhost:3000/login'</script>");
            }
            res.end();
        }
    })
})


app.get('/', function(req,res){
    db.query(`SELECT * FROM topic`, function(error, topics){
        loging = CheckLogin(req,res);
        console.log(loging);
        res.render('homepage',{loging: CheckLogin(req,res), numOfpage: template.pageList(topics), topics: `${topics}`, pg: '1', list: template.list(topics,1)});
    });
});
app.get('/page/:Id', function(req,res){
    db.query(`SELECT * FROM topic`, function(error, topics){
        var pg = req.params.Id;
        console.log(pg);
        res.render('homepage',{loging: CheckLogin(req,res), numOfpage: template.pageList(topics), topics: `${topics}`, pg: `${pg}`, list: template.list(topics,pg)});
    });
});
app.post(`/logout_process`,function(req,res){
    res.writeHead(302, {
        'Set-Cookie': [
          `email=; Max-Age=0`,
        ],
        Location: `/`
    });
    res.end();
})
app.get('/create', function(req,res){
    loging = CheckLogin(req,res);
    if(loging){
       res.render('create_topic',{title:'create', action:'/create_process'});
    }else{
        res.redirect(404);
    }
});

app.post("/create_process", function(req,res){
    var post = req.body;
    var cookies = {};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }

    console.log(post);
    var title = post.title.trim();
    var description = post.description.trim();
    if(title==''||description==''){
        res.send("<script>alert('fill the blank!');location.href='http://localhost:3000/create'</script>");
    }
    else{db.query(`SELECT * FROM user WHERE email=?`,[cookies.email],function(err,user){
            db.query(`INSERT INTO topic (title, description, user_id) VALUES(?, ?, ?);`,
            [title, description, user[0].id],
            function(err, result){
                res.redirect(`/${result.insertId}`);
            })
        })
    }
});

app.get(`/:pageId`, function(req,res){
    console.log(10);
    var Id = req.params.pageId;
    var authUI3 = ``;
    var cookies ={};
    if(req.headers.cookie){
        cookies = cookie.parse(req.headers.cookie);
    }
    db.query(`SELECT * FROM topic WHERE topic.id=?`,[Id],function(error2,topic){
        var title = topic[0].title;
        var description = topic[0].description;
        loging = CheckLogin(req,res);
        if(loging){
            db.query(`SELECT * FROM user WHERE email =?`,[cookies.email],function(err,user){
                res.render('view_pages', {Id: `${Id}`, title: `${title}`, description: `${description}`,topic_user_id: `${topic[0].user_id}`, user_id: `${user[0].id}`, time: `${topic[0].time}`, author: `${topic[0].user_id}`});
            });  

        }else{
            res.render('view_pages',{Id: `${Id}`, title: `${title}`, description: `${description}`,topic_user_id: undefined, user_id: undefined, time: `${topic[0].time}`, author: `${topic[0].user_id}`});
        }                
    })
})
app.get(`/user/create_account`, function(req,res){
    res.render('create_account', {title: 'create_account', action: '/user/create_process'});
});

app.post(`/user/create_process`, function(req, res){
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
app.get(`/update/:Id`, function(req,res){
    var Id = req.params.Id;
    db.query(`SELECT * FROM topic WHERE id = ?`,[Id], function(err, topic){
        res.render('update_topic', {title: 'update', action: `/update_process/${Id}`, topicTitle: `${topic[0].title}`,topicDescription: `${topic[0].description}`, Id: `${Id}`})
    })
})
app.post(`/update_process/:Id`, function(req, res){
    var Id = req.params.Id;
    var post = req.body;
    var title = post.title.trim();
    var description = post.description.trim();
    if(title==''||description==''){
        res.send(`<script>alert('fill the blank!');location.href="http://localhost:3000/update/${Id}"</script>`);
    }else{
        db.query(`UPDATE topic SET title=?, description=? WHERE id=?`,[title, description,Id], function(err,result){
            res.redirect(`/${Id}`);
        })
    }
})
app.post(`/delete_process`, function(req, res){
    console.log(req.body);
    var post = req.body;
    console.log(post.id);
    db.query(`DELETE FROM topic WHERE id = ?`,[post.id],function(err,result){
        res.redirect(`/`);
    })
})
app.listen(3000, function(){
    console.log(`on going!`);
});