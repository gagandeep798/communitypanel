var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.post("/cancelcommunity/:id", function (re, rs) {
        Community.updateOne(
            { "_id": re.params.id },
            { $pull: { 'request': re.session.data._id } },
            (err, result) => {
                if (err) console.log("community cancelcomminity error--" + err);
            }
        )
        Person.updateOne(
            { "_id": re.session.data._id },
            { $pull: { 'pending': re.params.id } },
            (err, result) => {
                if (err) console.log("person cancelcommunity error--" + err);
            }
        )
        for (i = 0; i < re.session.data.pending.length; i++) {
            if (re.session.data.pending[i] === re.params.id) {
                re.session.data.pending.splice(i, 1);
            }
        }
        rs.redirect('/home');
    })
}