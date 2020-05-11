const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const TestSchema = new Schema({
    testDate: { type: Date, required: true, default: null },
    responsibleTechnicianId: { type: String, required: true, default: null },
    pdfFilePath: { type: String, required: true, default: null },
    result: { type: Boolean, required: true, default: null }
});

const RequestSchema = new Schema({
    requesterUsername: { type: String, required: true },
    description: { type: String, required: true },
    priority: { type: String, required: true },
    userState: { type: String, default: 'Suspect' },
    submitDate: { type: Date, default: Date(Date.now()) },
    firstTest: { type: TestSchema, default: null },
    secondTest: { type: TestSchema, default: null },
    resultDate: { type: Date, default: null },
    isInfected: { type: Boolean, default: null }
});

module.exports = mongoose.model("Request", RequestSchema);