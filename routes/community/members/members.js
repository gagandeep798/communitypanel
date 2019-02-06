var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/communitymembers/:role/:id', function (re, rs, next) {
        console.log("role  " + re.params.role)
        Community.findOne({ "_id": re.params.id })
            .populate('owner')
            .populate('admin')
            .populate('user')
            .exec(function (error, data) {
                if (error) console.log("erroe   " + error);
                //console.log(data);
                rs.render('community/communitymembers', { comm: data, role: re.params.role, ulists: data.user, uno: data.user.length, alists: data.admin, ano: data.admin.length + 1, olist: data.owner, user: re.session.data });
            })
    })
}