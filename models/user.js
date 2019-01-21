var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({
    name: { type: String, default: '' },
    email: { type: String, default: '' },
    password: { type: String },
    image: { type: String, default: '' },
    dob: { type: String, default: '' },
    gender: { type: String, default: '' },
    city: { type: String, default: '' },
    phone: { type: String, default: '' },
    interest: { type: String, default: '' },
    journey: { type: String, default: '' },
    expectation: { type: String, default: '' },
    activated: { type: String, default: 'Deactivated' },
    role: { type: String, default: '' },
    status: { type: Number, default: 1 },
    comm: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    invitation: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    pending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    owner: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }]
});
module.exports = mongoose.model('Person', UserSchema);