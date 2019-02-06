module.exports = function (app) {
    app.get('/logout', function (re, rs) {
        re.session.data = 0;
        rs.redirect('/');
    })
}