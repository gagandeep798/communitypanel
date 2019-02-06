var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/createcommunity', function (re, rs) {
        rs.render('community/createcommunity', { smsg: "", dmsg: "", user: re.session.data })
    })

    app.post('/createcommunity', function (re, rs) {
        Community.findOne({ "name": re.body.name }, function (err, res) {
            if (err) console.log(err)
            if (res) {
                rs.render("community/createcommunity", { smsg: "", dmsg: "Community allready exits", user: re.session.data });
            } else {
                var newcomm = new Community(re.body)
                newcomm.save(function (err, Community) {
                    if (err) console.log(err);
                    Person.updateOne(
                        { "_id": re.session.data._id },
                        { $push: { 'owner': Community } },
                        function (err, result) {
                            if (err) console.log("ERRORERROR" + err);
                            rs.render("community/createcommunity", { smsg: "Success", dmsg: "", user: re.session.data });
                        }
                    )
                })
            }
        })
    })
}