var Person = require('../../../../models/user');
var Community = require('../../../../models/community');
module.exports = function (app) {
    app.get('/updateuser', function (re, rs) { // updateuser
        rs.render("users/updateuser", { smsg: "", user: re.session.data })
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
}