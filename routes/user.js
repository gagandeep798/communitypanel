var nodemailer = require('nodemailer');
var User = require('../models/user');
var Community = require('../models/community');
var secret = require('../secret/secret.js');
var objectId = require('mongodb').ObjectID;
var multer = require('multer');

module.exports = function (app) {

    app.get('/', function (re, rs) { // login get
        rs.render("users/login", { dmsg: '' })
    })

    app.get('/detail', function (re, rs) { // updateuser
        rs.render("users/detail", { user: re.session.data })
    })

    app.get('/userprofile', function (re, rs) { // userprofile
        rs.render("users/userprofile", { user: re.session.data })
    })

    app.get('/admin/adduser', function (re, rs) {
        rs.render("users/adduser", { smsg: "", dmsg: '', user: re.session.data });
    })

    app.get('/updateuser', function (re, rs) { // updateuser
        rs.render("users/updateuser", { smsg: "", user: re.session.data })
    })

    app.get('/changepassword', function (re, rs) { // changepassword
        rs.render("users/changepassword", { smsg: "", dmsg: '', user: re.session.data })
    })

    app.get('/userlist', function (re, rs) { // userlist
        Person.find({}, { _id: 0 }, function (err, res) {
            var list = res;
            rs.render("users/table", { user: re.session.data, ulists: list });
        })
    })

    app.get('/logout', function (re, rs) {
        re.session.data = 0;
        rs.redirect('/');
    })

    app.get('/css/:id', function (re, rs) { // userprofile
        rs.send("/css/" + re.params.id);
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
                        if (res.status == 1)
                            rs.redirect('/detail');
                        else rs.redirect('/home');
                    } else rs.render("users/login", { dmsg: "User is not ACTIVE" });
                } else rs.render("users/login", { dmsg: "User EMAIL and PASSWORD doesnot match" })
            } else rs.render("users/login", { dmsg: "Not Valid User" })
        })
    })

    app.post('/admin/adduser', function (re, rs) {
        var newuser = new Person(re.body);
        newuser.role = re.body.roleoptions;
        Person.findOne({ "email": re.body.email }, function (err, res) {
            if (err) console.log(err)
            if (res) {
                rs.render("users/adduser", { smsg: "", dmsg: "User allready exits", user: re.session.data });
            } else {
                newuser.save(function (err, Person) {
                    if (err)
                        rs.send(err);
                    rs.render("users/adduser", { smsg: "User Added", dmsg: "", user: re.session.data });
                    console.log("User Added");
                })
            }
        })
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
                    "interest": re.body.interest,
                    "expectation": re.body.expectation,
                    "firsttime": 0,
                    "status": 0
                }
            }, function (err, result) {
                if (err) console.log("ERRORERROR" + err);
            }
        )
        rs.redirect('/home');
    })

    app.post('/updateuser', function (re, rs) {
        Person.updateOne(
            { "email": re.session.data.email },
            {
                $set:
                {
                    "name": re.body.name,
                    "dob": re.body.dob,
                    "gender": re.body.gender,
                    "city": re.body.city,
                    "phone": re.body.phone,
                    "interest": re.body.interest,
                    "journey": re.body.journey
                }
            }, function (err, result) {
                if (err) console.log("ERRORERROR" + err);
                Person.findOne({ "email": re.session.data.email }, function (err, res1) {
                    re.session.data = res1;
                    rs.render("users/updateuser", { smsg: "User Profile Updated ", user: re.session.data })
                })
            }
        )
    })

    app.post('/changepassword', function (re, rs) {
        if (re.session.data.password == re.body.oldpassword) {
            Person.findOneAndReplace({ "email": re.session.data.email }, { $set: { "password": re.body.newpassword } }, function (err, res) {
                if (err) console.log(err);
                else {
                    re.session.data.password = re.body.newpassword;
                    rs.render('users/changepassword', { smsg: "Password Change Successful", dmsg: '', user: re.session.data })
                }
            })
        } else if (re.session.data.password != re.body.oldpassword) {
            rs.render('users/changepassword', { smsg: '', dmsg: "Enter correct Password", user: re.session.data })
        }
        else rs.render('users/changepassword', { smsg: "Password Changed", dmsg: '', user: re.session.data })
    })
}
