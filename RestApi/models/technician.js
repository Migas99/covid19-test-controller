const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    username: String,
    password: String,
    fullName: String,
    civilNumber: Number,
    registerDate: Date,
    address: String,
    phoneNumber: Number,
    email: String
});

module.exports = mongoose.model("Technician", productSchema);