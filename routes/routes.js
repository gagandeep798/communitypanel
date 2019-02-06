var Person = require('../models/user');
var Community = require('../models/community');
module.exports = function (app) {
    require('./community/community')(app);
    require('./user/user')(app);
}