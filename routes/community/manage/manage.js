var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/communitymembers/manage/:role/:id', function (re, rs) {
        Community.findOne({ "_id": re.params.id })
            .populate(re.params.role)
            .populate('owner')
            .populate('admin')
            .exec(function (error, data) {
                if (error) console.log("erroe   ");
                var admin = 0;
                if (data.owner._id == re.session.data._id)
                    admin = 1;
                for (i = 0; i < data.admin.length; i++) {
                    if (data.admin[0]._id == re.session.data._id)
                        admin = 1;
                }
                rs.render('community/communitymembers_manage', { comm: data, ulists: data.user, alists: data.admin, olist: data.owner, rlists: data.request, ilists: data.inviedUser, admin: admin, role: re.params.role, uno: data.user.length, ano: data.admin.length + 1, rno: data.request.length, ino: data.invitedUser.length, id: re.params.id, user: re.session.data });
            })
    })
}