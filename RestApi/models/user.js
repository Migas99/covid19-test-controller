const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    birthDate: Date,
    civilNumber: Number,
    registerDate: Date
});

module.exports = mongoose.model("User", productSchema);