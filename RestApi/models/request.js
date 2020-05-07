const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const RequestSchema = new Schema({
    requesterUsername: { type: String , required: true },
    description: { type: String , required: true },
    submitDate: { type: Date , default: Date.now },
    testDate: { type: Date , default: null },
    filePath: { type: String , default: null }
});

module.exports = mongoose.model("Request", RequestSchema);