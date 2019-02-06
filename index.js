var a = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var DataTable = require('mongoose-datatable');
var path = require('path');

var app = a();

mongoose.connect('mongodb://localhost/oneness', { useNewUrlParser: true });

app.use(a.static('/views'));
app.use(a.static('public/'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    resave: false,
    cookie: { maxAge: 600000 }
}));

mongoose.plugin(DataTable.init);
require('./routes/routes')(app);
app.listen(8000, function (err) {
    if (err) {
        console.log("listen err  " + err);
        return;
    }
    console.log('Running on 8000');
});