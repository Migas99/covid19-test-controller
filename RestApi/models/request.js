const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const RequestSchema = new Schema({
    requesterUsername: { type: String , required: true },
    description: { type: String , required: true },
    priority:{ type:String, required: true },
    submitDate: { type: Date , default: Date(Date.now()) },
    firstTestDate: { type: Date , default: null },
    firstTestFilePath: { type: String , default: null },
    firstTestTechnician: { type: String},
    firstResult: { type: Boolean, default: null },
    secondTestDate: { type: Date , default: null },
    secondTestFilePath: { type: String , default: null },
    secondTestTechnician: { type: String},
    secondResult: { type: Boolean, default: null },
    finalResultDate: { type: Date, default: null },
    isInfected: { type: Boolean, default: null }
});

module.exports = mongoose.model("Request", RequestSchema);