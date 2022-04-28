var cookie = require('cookie');

module.exports={
    list:function(topics, pg){
        var list = [];
        if(topics.length%20 == 0){
            numOfpage = topics.length/20;
        }else {
            numOfpage = Math.ceil(topics.length/20);
        }
        var keyNum = numOfpage - pg;
        if(pg==1){
            for(let i = topics.length-1;i>=20*(numOfpage-1);i--){
                list[i] = `<td><a href="/topic/${topics[i].id}">${topics[i].id}</td><td><a href="/topic/${topics[i].id}">${topics[i].title}</a></td><td>${topics[i].name}</td><td>${topics[i].time}</td>`
            }
        }else{
            for(let i = 19+20*keyNum;i>=20*keyNum;i--){
                list[i] = `<td><a href="/topic/${topics[i].id}">${topics[i].id}</td><td><a href="/topic/${topics[i].id}">${topics[i].title}</a></td><td>${topics[i].name}</td><td>${topics[i].time}</td>`
            }
        }
        console.log(list.length);
        return list;
    },pageList:function(topics){
        var numOfpage = 0;
        if(topics.length%20 == 0){
            numOfpage = topics.length/20;
        }else {
            numOfpage = Math.ceil(topics.length/20);
        }
        var pageList = ``;
        for(let i = 1;i<numOfpage+1;i++){
            pageList = pageList +`<a href="/global/${i}"> ${i}</a>`
        }
        return parseInt(numOfpage);
    },CheckLogin:function(req, res){
        var loging = false;
        var cookies = {};
        if(req.headers.cookie){
            cookies = cookie.parse(req.headers.cookie);
        }
        if(cookies.email ==undefined){
            loging = false;
        }else{
            loging = true;
        }
        return loging;
    }
} 