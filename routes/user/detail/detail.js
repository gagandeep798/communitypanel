var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
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
}