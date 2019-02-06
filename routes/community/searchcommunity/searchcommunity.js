var Person = require('../../../models/user');
var Community = require('../../../models/community');
module.exports = function (app) {
    app.get('/searchcommunity', function (re, rs) {
        Person.findOne({ "_id": re.session.data._id }, function (err, res) {
            re.session.data = res;
            var list1 = re.session.data.owner.concat(re.session.data.comm, re.session.data.invitation, re.session.data.pending);
            Community.find({}, function (err, res) {
                if (err) console.log(err);
                var list = res;
                l1 = list.length;
                l2 = list1.length;
                if (l1 > 0 && l2 > 0) {
                    for (i = 0; i < l1; i++) {
                        for (j = 0; j < l2, i < l1; j++) {
                            if (i < l1 && j < l2) {
                                if (list1[j].equals(list[i]._id)) {
                                    //  console.log("splice");
                                    list.splice(i, 1);
                                    l1--;
                                }
                            } else break;
                        }
                    }
                }
                rs.render('community/searchcommunity', { comms: list, msg: " ", user: re.session.data });
            })
        })
    })
    app.post('/searchcommunity', function (re, rs) {
        Community.find({ "name": re.body.search }, function (err, res) {
            var list = res;
            var msg1;
            if (list.length > 0) {
                mgs1 = "";
            } else { msg1 = "Ooops !" }
            rs.render('community/searchcommunity', { comms: list, msg: msg1, user: re.session.data });
        })
    })
}