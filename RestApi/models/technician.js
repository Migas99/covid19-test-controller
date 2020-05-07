const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const TechnicianSchema = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    civilNumber: { type: String, required: true },
    registerDate: { type: Date, default: Date.now },
    address: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String, required: true }
});

module.exports = mongoose.model("Technician", TechnicianSchema);