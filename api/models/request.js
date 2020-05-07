const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    requesterUsername: String,
    description: String,
    submitDate: Date,
    testDate: Date,
    filePath: String
});

module.exports = mongoose.model("Request", productSchema);