var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/userlist', function (re, rs) { // userlist
        Person.find({}, { _id: 0 }, function (err, res) {
            var list = res;
            rs.render("users/table", { user: re.session.data, ulists: list });
        })
    })
    app.post('/ulist', function (re, rs) {
        Person.find({}, (err, res) => {
            console.log(res);
            rs.json(res);
        })
    })
}