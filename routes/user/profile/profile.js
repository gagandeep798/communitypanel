var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    require('./updateprofile/updateprofile')(app);
    app.get('/userprofile', function (re, rs) { // userprofile
        rs.render("users/userprofile", { user: re.session.data })
    })
}