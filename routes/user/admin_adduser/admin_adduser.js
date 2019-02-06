var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/admin/adduser', function (re, rs) {
        rs.render("users/adduser", { smsg: "", dmsg: '', user: re.session.data });
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
}