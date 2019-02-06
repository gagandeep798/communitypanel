var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/', function (re, rs) { // login get
        rs.render("users/login", { dmsg: '' })
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
}