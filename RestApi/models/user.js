const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    gender: { type: String, required: true },
    birthDate: { type: Date, required: true },
    civilNumber: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    role: { type: String, required: true, default: 'USER' },
    registerDate: { type: Date, default: Date.now() },
    state: { type: String, default: 'Suspect' }
});

module.exports = mongoose.model("User", UserSchema);