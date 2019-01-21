var a = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var DataTable = require('mongoose-datatable');
var path = require('path');
//DataTable.comfigure()
mongoose.connect('mongodb://localhost/oneness', { useNewUrlParser: true });
var app = a();
app.use(a.static('/views'));
app.use(a.static('public/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    resave: false,
    cookie: { maxAge: 600000 }
}));
app.set('view engine', 'ejs');
mongoose.plugin(DataTable.init);

var Person = require('./models/user');
var Community = require('./models/community');
mongoose.plugin(DataTable.init);
// app.get('/table', function (re, rs) { // login get
//     rs.render("users/table", { user: re.session.data });
// })
app.get('/table', function (req, res) {
    Community.find({ "name": "First" })
        .populate('owner')
        .populate('admin')
        .populate('user')
        .populate('invitedUser')
        .populate('request')
        .exec(function (error, data) {
            if (error)
                console.log("erroe    " + error);
            //var data2 = JSON.parse(data.owner);
            console.log("data   " + data[0].user[0].email);
            res.send(data);
        });
})
app.post('/userlist', function (req, res) {
    var obj = req.body;
    //console.log(obj);
    //window.alert("sdfg");
    Person.find({}, { "email": 1, "name": 1, "city": 1, "phone": 1, "status": 1, "role": 1 }, function (err, result) {
        //console.log(result);
        console.log(result);
        res.json(result);
    })
    //res.json(req.session.data);
    // Person.dataTable({ obj }, function (err, table) {
    //     if (err) console.log(err);
    //     console.log(table);
    //     res.json(table);
    // });
})
app.get('/', function (re, rs) { // login get
    rs.render("users/login", { msg: '' })
})
app.post('/', function (re, rs) { // login post
    var us = re.body;
    var v = 1;
    Person.findOne({ "email": us.username }, function (err, res) {
        if (err) console.log(err);
        if (res) {
            if (res.password == re.body.password) {
                re.session.data = res;
                if (res.activated === 'Activated') {
                    if (res.status === 1)
                        rs.redirect('/detail');
                    else rs.redirect('/home');
                } else rs.render("users/login", { msg: "User is not ACTIVE" });
            } else rs.render("users/login", { msg: "User EMAIL and PASSWORD doesnot match" })
        } else rs.render("users/login", { msg: "Not Valid User" })
    })
})


/////  adduser
app.get('/admin/adduser', function (re, rs) {
    rs.render("users/adduser", { msg: "", user: re.session.data });
})
app.post('/admin/adduser', function (re, rs) {
    var newuser = new Person(re.body);
    newuser.role = re.body.roleoptions;
    Person.findOne({ "email": re.body.email }, function (err, res) {
        if (err) console.log(err)
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
            if (err) console.log(err);
            else rs.render('users/changepassword', { msg: "Password Change Successful", user: re.session.data })
        })
    } else if (old != old1) {
        rs.render('users/changepassword', { msg: "Enter correct Password", user: re.session.data })
    }
    else rs.render('users/changepassword', { msg: "Password Changed", user: re.session.data })
})


app.get('/updateuser', function (re, rs) { // updateuser
    rs.render("users/updateuser", { msg: "", user: re.session.data })
})


app.post('/updateuser', function (re, rs) {
    Person.findOneAndUpdate({ "email": re.session.data.email }, { $set: {} }, function (err, res) {
        if (err) console.log(err);
        rs.render("users/updateuser", { msg: "User Profile Update !", user: re.session.data })
    })
})


app.get('/detail', function (re, rs) { // updateuser
    rs.render("users/detail", { user: re.session.data })
})


app.post('/userdetails', function (re, rs) {
    Person.updateOne(
        { "email": re.session.data.email },
        {
            $set:
            {
                "name": re.body.name,
                "dob": re.body.dob,
                "gender": re.body.roleoptions,
                "interest": re.body.inerest,
                "firsttime": 0
            }
        }, function (err, result) {
            if (err) console.log("ERRORERROR" + err);
        }
    )
    rs.redirect('/home');
})


app.get('/userlist', function (re, rs) { // userlist
    Person.find({}, { _id: 0 }, function (err, res) {
        var list = res;
        rs.render("users/table", { user: re.session.data, ulists: list });
    })
})

app.get('/home', function (re, rs) {
    Person.findOne({ "_id": re.session.data._id }, function (err, res) {
        re.session.data = res;
        var list1 = re.session.data.owner.concat(re.session.data.comm, re.session.data.invitation, re.session.data.pending);
        re.session.data.list = list1;
        // console.log("owner-- " + re.session.data.owner.length + re.session.data.owner);
        // console.log("comm-- " + re.session.data.comm.length + re.session.data.comm);
        // console.log("invitations -- " + re.session.data.invitation.length + re.session.data.invitation);
        // console.log("pending-- " + re.session.data.pending.length + re.session.data.pending);

        // for (i = 0; i < list1.length; i++)
        //     console.log(list1[i]);
        Community.find({ "_id": list1 }, function (err, resp) {
            var res = resp;
            // for (i = 0; i < res.length; i++)
            //     console.log("i=" + i + " " + res[i].name + "  " + res[i]._id);
            var owner = [], comm = [], invitations = [], pending = [];
            o = re.session.data.owner.length;
            c = re.session.data.comm.length;
            inv = re.session.data.invitation.length;
            p = re.session.data.pending.length;
            for (i = 0; i < res.length; i++) {
                if (o > 0) {
                    owner.push(res[i]);
                    o--;
                } else if (c > 0) {
                    comm.push(res[i]);
                    c--;
                } else if (inv > 0) {
                    invitations.push(res[i]);
                    inv--;
                } else if (p > 0) {
                    pending.push(res[i]);
                    p--;
                }
            }
            // console.log("owner -" + owner);
            // console.log("comm -" + comm);
            // console.log("invite -" + invitations);
            // console.log("pend -" + pending);
            rs.render('community/community', { owners: owner, comms: comm, invities: invitations, pendings: pending, user: re.session.data });
        })
    })
})

app.get('/userprofile', function (re, rs) { // userprofile
    rs.render("users/userprofile", { user: re.session.data })
})


app.get('/css/:id', function (re, rs) { // userprofile
    rs.send("/css/" + re.params.id);
})


app.get('/communitylist', function (re, rs) { // userlist
    Community.find({}, { _id: 0 }, function (err, res) {
        rs.render("community/communitylist", { user: re.session.data, clists: res });
    })
})


app.get('/createcommunity', function (re, rs) {
    rs.render('community/createcommunity', { msg: " ", user: re.session.data })
})


app.post('/createcommunity', function (re, rs) {
    Community.findOne({ "name": re.body.name }, function (err, res) {
        if (err) console.log(err)
        if (res) {
            rs.render("community/createcommunity", { msg: "Community allready exits", user: re.session.data });
        } else {
            var newcomm = new Community({
                name: re.body.name,
                description: re.body.desc,
                owner: re.session.data._id,
                rule: re.body.rule
            })
            newcomm.save(function (err, Community) {
                if (err) console.log(err);
                console.log(Community);
                Person.updateOne(
                    { "_id": re.session.data._id },
                    {
                        $push:
                        {
                            'owner': Community
                        }
                    }, function (err, result) {
                        if (err) console.log("ERRORERROR" + err);
                        else console.log(result);
                        rs.render("community/createcommunity", { msg: "Success", user: re.session.data });
                    })
            })
        }
    })
})


app.get('/communityprofile/:id', function (re, rs, next) {
    Community.findOne({ "_id": re.params.id })
        .populate('owner')
        .populate('admin')
        .populate('user')
        .exec(function (error, data) {
            if (error) console.log("erroe   " + error);
            //console.log("res   " + data.user);
            if (data.user.length > 4) {
                ulists = data.user.splice(0, 4);
            } else ulists = data.user;
            rs.render('community/communityprofile', { comm: data, ulists: ulists, ulistmem: data.user.length, alists: data.admin, olists: data.owner, user: re.session.data });

        })
})
app.get('/communitymembers/:role/:id', function (re, rs, next) {
    console.log("role  " + re.params.role)
    Community.findOne({ "_id": re.params.id })
        .populate('owner')
        .populate('admin')
        .populate('user')
        .exec(function (error, data) {
            if (error) console.log("erroe   " + error);
            //console.log(data);
            rs.render('community/communitymembers', { comm: data, role: re.params.role, ulists: data.user, uno: data.user.length, alists: data.admin, ano: data.admin.length + 1, olist: data.owner, user: re.session.data });
        })
})
app.get('/communitymembers/manage/:role/:id', function (re, rs) {
    Community.findOne({ "_id": re.params.id })
        .populate(re.params.role)
        .populate('owner')
        .populate('admin')
        .exec(function (error, data) {
            if (error) console.log("erroe   ");
            var admin = 0;
            if (data.owner._id == re.session.data._id)
                admin = 1;
            for (i = 0; i < data.admin.length; i++) {
                if (data.admin[0]._id == re.session.data._id) {
                    admin = 1;
                }
            }
            rs.render('community/communitymembers_manage', { comm: data, ulists: data.user, alists: data.admin, olist: data.owner, rlists: data.request, ilists: data.inviedUser, admin: admin, role: re.params.role, uno: data.user.length, ano: data.admin.length + 1, rno: data.request.length, ino: data.invitedUser.length, id: re.params.id, user: re.session.data });
        })
})
app.post("/joincommunity/:id", function (re, rs) {
    Community.updateOne(
        { "_id": re.params.id },
        {
            $push:
            {
                'user': re.session.data._id
            }
        }, (err, result) => {
            if (err) console.log("ERRORERROR" + err);
            else console.log(result);
            Person.updateOne(
                { "_id": re.session.data._id },
                {
                    $push:
                    {
                        'comm': re.params.id
                    }
                }, function (err, result) {
                    if (err) console.log("ERRORERROR" + err);
                    else console.log(result);
                    rs.redirect('/searchcommunity');
                })
        })
})
app.post("/asktojoincommunity/:id", function (re, rs) {
    Community.updateOne(
        { "_id": re.params.id },
        {
            $push:
            {
                'request': re.session.data._id
            }
        }, (err, result) => {
            if (err) console.log("ERRORERROR" + err);
            else console.log(result);
            Person.updateOne(
                { "_id": re.session.data._id },
                {
                    $push:
                    {
                        'pending': re.params.id
                    }
                }, function (err, result) {
                    if (err) console.log("ERRORERROR" + err);
                    else console.log(result);
                    rs.redirect('/searchcommunity');
                })
        })

})


app.get('/searchcommunity', function (re, rs) {
    Person.findOne({ "_id": re.session.data._id }, function (err, res) {
        re.session.data = res;
        var list1 = re.session.data.owner.concat(re.session.data.comm, re.session.data.invitation, re.session.data.pending);
        //console.log("list1" + list1);
        Community.find({}, function (err, res) {
            if (err) console.log(err);
            var list = res;
            l1 = list.length;
            l2 = list1.length;
            if (l1 > 0 && l2 > 0) {
                for (i = 0; i < l1; i++) {
                    for (j = 0; j < l2, i < l1; j++) {
                        if (i < l1 && j < l2) {
                            //console.log("list -" + list[i]._id + "  list1 -" + list1[j]);
                            if (list1[j].equals(list[i]._id)) {
                                //  console.log("splice");
                                list.splice(i, 1);
                                l1--;
                            }
                        } else break;
                    }
                }
            }
            rs.render('community/searchcommunity', { comms: list, msg: " ", user: re.session.data });
        })
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


app.get('/logout', function (re, rs) {
    re.session.data = 0;
    rs.redirect('/');
})

//// Server listen on 8000
app.listen(8000, function () {
    console.log('Running on 8000');
});