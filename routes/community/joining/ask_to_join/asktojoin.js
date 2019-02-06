var Person = require('../../../../models/user');
var Community = require('../../../../models/community');
module.exports = function (app) {
    app.post("/asktojoincommunity/:id", function (re, rs) {
        Community.updateOne(
            { "_id": re.params.id },
            { $push: { 'request': re.session.data._id } },
            (err, result) => {
                if (err) console.log("ERRORERROR" + err);
                else console.log(result);
                Person.updateOne({ "_id": re.session.data._id },
                    { $push: { 'pending': re.params.id } },
                    function (err, result) {
                        if (err) console.log("ERRORERROR" + err);
                        else console.log(result);
                        rs.redirect('/searchcommunity');
                    }
                )
            }
        )
    })
}