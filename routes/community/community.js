var Person = require('../../models/user');
module.exports = function (app) {
    require('./cancel/cancel')(app);
    require('./createcommunity/createcommunity')(app);
    require('./joining/joining')(app);
    require('./list/list')(app);
    require('./manage/manage')(app);
    require('./members/members')(app);
    require('./profile/profile')(app);
    require('./searchcommunity/searchcommunity')(app);
    app.get('/home', function (re, rs) {
        Person.findOne({ "_id": re.session.data._id })
            .populate('owner')
            .populate('comm')
            .populate('invitation')
            .populate('pending')
            .exec(function (err, data) {
                rs.render('community/community', { owners: data.owner, comms: data.comm, invities: data.invitation, pendings: data.pending, user: re.session.data });
            })
    })
}