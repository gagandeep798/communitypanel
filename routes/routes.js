module.exports = function (app) {
    require('./community/community')(app);
    require('./user/user')(app);
}