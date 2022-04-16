module.exports={
    list:function(topics, pg){
        var list = ``;
        console.log('topics.length is', topics.length);
        if(topics.length%20 == 0){
            numOfpage = topics.length/20;
        }else {
            numOfpage = Math.ceil(topics.length/20);
        }
        var keyNum = numOfpage - pg;
        console.log(`pg is`,pg);
        if(pg==1){
            for(let i = topics.length-1;i>=20*(numOfpage-1);i--){
                list = list + `<li><a href="/${topics[i].id}">${topics[i].title}</a></li>`
            }
        }else{
            for(let i = 19+20*keyNum;i>=20*keyNum;i--){
                list = list + `<li><a href="/${topics[i].id}">${topics[i].title}</a></li>`
            }
        }
        console.log(list);
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
            pageList = pageList +`<a href="/page/${i}"> ${i}</a>`
        }
        console.log('numofpage', numOfpage);
        return parseInt(numOfpage);
    }
} 