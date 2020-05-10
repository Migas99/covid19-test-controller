const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const RequestSchema = new Schema({
    requesterUsername: { type: String , required: true },
    description: { type: String , required: true },
    submitDate: { type: Date , default: Date(Date.now()) },
    firstTestDate: { type: Date , default: null },
    firstTestFilePath: { type: String , default: null },
    firstResult: { type: Boolean, default: null },
    secondTestDate: { type: Date , default: null },
    secondTestFilePath: { type: String , default: null },
    secondResult: { type: Boolean, default: null },
    finalResultDate: { type: Date, default: null },
    finalResult: { type: Boolean, default: null }
});

module.exports = mongoose.model("Request", RequestSchema);