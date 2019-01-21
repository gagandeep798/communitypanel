var mongoose = require('mongoose');
var CommunitySchema = mongoose.Schema({
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    rule: { type: String, default: '' },
    image: { type: String, default: '' },
    date: { type: String, default: '' },
    activated: { type: String, default: 'yes' },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    },
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    }],
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    }],
    invitedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    }],
    request: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person'
    }]
})
module.exports = mongoose.model('Community', CommunitySchema);