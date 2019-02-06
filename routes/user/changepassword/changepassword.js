var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/changepassword', function (re, rs) { // changepassword
        rs.render("users/changepassword", { smsg: "", dmsg: '', user: re.session.data })
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