const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    }
    //the passportLocalMongoose will automatically add the user and password in schema. and the password will in hash and salt form.
    //to do so we need to add the plugin.

    //OR we can also add the username and password in schema.
});
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);

//we can also add the username and password in schema.
// const userSchema = new Schema({
//     username: {
//         type: String,
//         required: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// });
// User.plugin(passportLocalMongoose);
// module.exports = mongoose.model('User', userSchema);