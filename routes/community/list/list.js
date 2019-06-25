var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/communitylist', function (re, rs) {
        rs.render("community/communitylist", { user: re.session.data });
    })
    app.post('/communitylist', function (re, rs) {
        Community.find({})
            .populate('owner')
            .exec(function (err, res) {
                var data = JSON.stringify({
                    'data': res
                })
                rs.send(data);
            })
    })
}