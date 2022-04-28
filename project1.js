var bodyParser = require('body-parser');
var express = require('express');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine', 'ejs');
app.set('views', './views');

const topic = require('./routes/topic');
const user = require('./routes/user');
const global = require('./routes/global');
app.use('/', global);
app.use('/topic', topic);
app.use('/user', user);

app.listen(3000, function(){
    console.log(`on going!`);
});