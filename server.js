var a = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoDataTable = require('mongo-datatable');
var MongoClient = require('mongodb').MongoClient;
mongoose.connect('mongodb://localhost/oneness', { useNewUrlParser: true });
var app = a();

app.use(a.static('/views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    resave: false,
    cookie: { maxAge: 600000 }
}));
app.set('view engine', 'ejs');
var UserSchema = mongoose.Schema({
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    city: { type: String, default: '' },
    password: String,
    role: String,
    name: { type: String, default: '' },
    dob: { type: Date, default: '' },
    gender: { type: String, default: '' },
    interest: { type: String, default: '' },
    active: Number,
    firsttime: Number,
    comm: Array
});
var CommSchema = mongoose.Schema({
    name: { type: String, default: '' },
    desc: { type: String, default: '' },
    rule: { type: String, default: '' },
    owner: Array,
    admin: Array,
    user: Array,
    request: Array
})
var Person = mongoose.model("Person", UserSchema);
var Community = mongoose.model("Community", CommSchema);

////////////////////////////
app.get('/', function (re, rs) { // login get
    rs.render("users/login", { msg: '' })
})
///////
app.post('/', function (re, rs) { // login post
    var us = re.body;
    var v = 1;
    Person.findOne({ "email": us.username }, function (err, res) {
        if (err) {
            console.log(err);
        }
        if (res) {
            if (res.password == re.body.password) {
                re.session.data = res;
                if (res.active) {
                    if (res.firsttime)
                        rs.redirect('/detail');
                    rs.redirect('/home');
                } else {
                    rs.render("users/login", { msg: "User is not ACTIVE" });
                }
            } else {
                rs.render("users/login", { msg: "User EMAIL and PASSWORD doesnot match" })
            }
        } else {
            rs.render("users/login", { msg: "Not Valid User" })
        }
    })
})
/////////////////////////////
/////  adduser
app.get('/admin/adduser', function (re, rs) {
    rs.render("users/adduser", { msg: "", user: re.session.data })
})
app.post('/admin/adduser', function (re, rs) {
    var newuser = new Person(re.body);
    newuser.active = 0;
    newuser.firsttime = 1;
    newuser.name = "";
    newuser.role = re.body.roleoptions;
    Person.findOne({ "email": re.body.email }, function (err, res) {
        if (err) {
            console.log(err)
        }
        if (res) {
            rs.render("users/adduser", { msg: "User allready exits", user: re.session.data });
        } else {
            newuser.save(function (err, Person) {
                if (err)
                    rs.send(err);
                rs.render("users/adduser", { msg: "User Added", user: re.session.data });
                console.log("User Added");
            })
        }
    })
})
///////////////////////////
/////////////////////////
app.get('/changepassword', function (re, rs) { // changepassword
    rs.render("users/changepassword", { msg: "", user: re.session.data })
})
app.post('/changepassword', function (re, rs) {
    var old1 = re.body.oldpassword;
    var old = re.session.data.password;
    var new1 = re.body.newpassword;
    if (old == old1) {
        console.log("in if");
        Person.findOneAndReplace({ "email": re.session.data.email }, { $set: { "password": new1 } }, function (err, res) {
            //if (err) console.log(err);
            rs.render('users/changepassword', { msg: "Password Change Successful", user: re.session.data })
        })
    } else if (old != old1) {
        console.log("in else if");
        rs.render('users/changepassword', { msg: "Enter correct Password", user: re.session.data })
    }
    rs.render('users/changepassword', { msg: "Password Changed", user: re.session.data })
})
////////////////////////////
app.get('/updateuser', function (re, rs) { // updateuser
    rs.render("users/updateuser", { msg: "", user: re.session.data })
})
app.post('/updateuser', function (re, rs) {
    Person.findOneAndUpdate({ "email": re.session.data.email }, { $set: {} }, function (err, res) {
        if (err) console.log(err);
        rs.render("users/updateuser", { msg: "User Profile Update !", user: re.session.data })
    })
})
///////////////////////
app.post('/userdetails', function (re, rs) {
    Person.findOneAndUpdate({ "email": re.session.data.email }, { $set: {} }, function (err, res) {
        if (err) console.log(err);
        rs.redirect('/home');
    })
})
////////////////////////////////
app.get('/userlist', function (re, rs) { // userlist
    Person.find({}, { _id: 0 }, function (err, res) {
        var list = res;
        rs.render("users/userlist", { user: re.session.data, ulists: list });
    })
})
app.get('/communitylist', function (re, rs) { // userlist
    Community.find({}, { _id: 0 }, function (err, res) {
        var list = res;
        rs.render("community/communitylist", { user: re.session.data, clists: list });
    })
})
//////////////////////////////////////
app.get('/home', function (re, rs) {
    Community.find({ "name": re.session.data.comm }, function (err, res) {
        var list = res;
        rs.render('community/community', { comms: list, user: re.session.data });
    })
})
///////////////////////////////////////
//////////////////////////////////////////////////
app.get('/createcommunity', function (re, rs) {
    rs.render('community/createcommunity', { msg: " ", user: re.session.data })
})
///////////////
app.post('/createcommunity', function (re, rs) {
    Community.findOne({ "name": re.body.name }, function (err, res) {
        if (err) {
            console.log(err)
        }
        if (res) {
            rs.render("community/createcommunity", { msg: "Community allready exits", user: re.session.data });
        } else {
            var newcomm = new Community({
                name: re.body.name,
                desc: re.body.desc,
                owner: re.session.data._id,
                rule: re.body.rule
            })
            newcomm.save(function (err, Community) {
                if (err)
                    rs.send(err);
                rs.render("community/createcommunity", { msg: "Success", user: re.session.data });
            })
        }
    })
})
/////////////////////////////////////
//////////////////////////////////////////////////////////
app.get('/communityprofile/:id', function (re, rs) {
    rs.send(re.params.id + "=" + re.session.data._id);
})
//////////////////////////////////////////
////////////////////////////////////////////////////////
app.get('/searchcommunity', function (re, rs) {
    Community.find({}, function (err, res) {
        var list = res;
        var urlist = re.session.data.comm;
        for (i = 0; i < list.length; i++) {
            for (j = 0; j < urlist.length; j++) {
                if (urlist[j] == list[i].name) {
                    list.splice(i, 1);
                }
            }
        }
        rs.render('community/searchcommunity', { comms: list, msg: " ", user: re.session.data });
    })
})
app.post('/searchcommunity', function (re, rs) {
    Community.find({ "name": re.body.search }, function (err, res) {
        var list = res;
        var msg1;
        if (list.length > 0) {
            mgs1 = "";
        } else { msg1 = "Ooops !" }
        rs.render('community/searchcommunity', { comms: list, msg: msg1, user: re.session.data });
    })
})

///////////////////////////////////////////////
/////////////////////////////////////////////////////////
app.get('/userprofile', function (re, rs) { // userprofile
    rs.render("users/userprofile", { user: re.session.data })
})
app.get('/css/:id', function (re, rs) { // userprofile
    rs.send("/css/" + re.params.id);
})

//////////////////////////
app.get('/logout', function (re, rs) {
    re.session.data = 0;
    rs.redirect('/');
})
//// Server listen on 8000
app.listen(8000, function () {
    console.log('Running on 8000');
});