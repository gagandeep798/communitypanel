module.exports = function (app) {
    require('./admin_adduser/admin_adduser')(app);
    require('./changepassword/changepassword')(app);
    require('./detail/detail')(app);
    require('./list/list')(app);
    require('./login/login')(app);
    require('./logout/logout')(app);
    require('./profile/profile')(app);
}