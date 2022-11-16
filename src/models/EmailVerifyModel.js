const mongoose = require('mongoose');
const EmailVerifySchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    token: {
        type: String,
        required: true
    }
});

const EmailVerify = mongoose.model('email_verify', EmailVerifySchema);

module.exports = EmailVerify;