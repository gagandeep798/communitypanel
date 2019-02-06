var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/communityprofile/:id', function (re, rs, next) {
        Community.findOne({ "_id": re.params.id })
            .populate('owner')
            .populate('admin')
            .populate('user')
            .exec(function (error, data) {
                if (error) console.log("erroe   " + error);
                if (data.user.length > 4) {
                    ulists = data.user.splice(0, 4);
                } else ulists = data.user;
                var mem = 0;
                if (re.session.data._id == data.owner._id) {
                    mem = 1;
                }
                if (mem == 0) {
                    for (i = 0; i < data.owner.length; i++) {
                        if (re.session.data._id == data.owner[i]._id) {
                            mem = 1; break;
                        }
                    }
                }
                if (mem == 0) {
                    for (i = 0; i < data.user.length; i++) {
                        if (re.session.data._id == data.user[i]._id) {
                            mem = 1; break;
                        }
                    }
                }
                if (mem == 0) {
                    for (i = 0; i < data.request.length; i++) {
                        if (re.session.data._id == data.request[i]) {
                            mem = 2; break;
                        }
                    }
                }
                rs.render('community/communityprofile', { mem: mem, comm: data, ulists: ulists, ulistmem: data.user.length, alists: data.admin, olists: data.owner, user: re.session.data });

            })
    })

}