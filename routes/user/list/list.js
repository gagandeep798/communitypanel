var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/userlist', function (re, rs) { // userlist
        rs.render("users/userlist", { user: re.session.data });
    })
    app.post('/userlist', function (re, rs) {
        Person.find({}, (err, res) => {
            var data = JSON.stringify({
                'data': res
            })
            rs.send(data);
        })
    })
} 