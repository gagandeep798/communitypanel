
var Person = require('../models/user');
var Community = require('../models/community');
module.exports = function (app) {

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

    app.get('/createcommunity', function (re, rs) {
        rs.render('community/createcommunity', { smsg: "", dmsg: "", user: re.session.data })
    })

    app.get('/communitylist', function (re, rs) { // userlist
        Community.find({}, { _id: 0 }, function (err, res) {
            rs.render("community/communitylist", { user: re.session.data, clists: res });
        })
    })

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
                    if (data.admin[0]._id == re.session.data._id) {
                        admin = 1;
                    }
                }
                rs.render('community/communitymembers_manage', { comm: data, ulists: data.user, alists: data.admin, olist: data.owner, rlists: data.request, ilists: data.inviedUser, admin: admin, role: re.params.role, uno: data.user.length, ano: data.admin.length + 1, rno: data.request.length, ino: data.invitedUser.length, id: re.params.id, user: re.session.data });
            })
    })
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

    app.post('/createcommunity', function (re, rs) {
        Community.findOne({ "name": re.body.name }, function (err, res) {
            if (err) console.log(err)
            if (res) {
                rs.render("community/createcommunity", { smsg: "", dmsg: "Community allready exits", user: re.session.data });
            } else {
                var newcomm = new Community({
                    name: re.body.name,
                    description: re.body.desc,
                    owner: re.session.data._id,
                    rule: re.body.rule
                })
                newcomm.save(function (err, Community) {
                    if (err) console.log(err);
                    Person.updateOne(
                        { "_id": re.session.data._id },
                        {
                            $push:
                            {
                                'owner': Community
                            }
                        }, function (err, result) {
                            if (err) console.log("ERRORERROR" + err);
                            rs.render("community/createcommunity", { smsg: "Success", dmsg: "", user: re.session.data });
                        })
                })
            }
        })
    })
    app.post("/joincommunity/:id", function (re, rs) {
        Community.updateOne(
            { "_id": re.params.id },
            {
                $push:
                {
                    'user': re.session.data._id
                }
            }, (err, result) => {
                if (err) console.log("ERRORERROR" + err);
                else console.log(result);
                Person.updateOne(
                    { "_id": re.session.data._id },
                    {
                        $push:
                        {
                            'comm': re.params.id
                        }
                    }, function (err, result) {
                        if (err) console.log("ERRORERROR" + err);
                        else console.log(result);
                        rs.redirect('/searchcommunity');
                    })
            })
    })
    app.post("/asktojoincommunity/:id", function (re, rs) {
        Community.updateOne(
            { "_id": re.params.id },
            {
                $push:
                {
                    'request': re.session.data._id
                }
            }, (err, result) => {
                if (err) console.log("ERRORERROR" + err);
                else console.log(result);
                Person.updateOne(
                    { "_id": re.session.data._id },
                    {
                        $push:
                        {
                            'pending': re.params.id
                        }
                    }, function (err, result) {
                        if (err) console.log("ERRORERROR" + err);
                        else console.log(result);
                        rs.redirect('/searchcommunity');
                    })
            })

    })
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