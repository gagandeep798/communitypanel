module.exports = function (app) {
    require('./ask_to_join/asktojoin')(app);
    require('./join/join')(app);
}