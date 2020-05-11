//Validações
const Joi = require('@hapi/joi');

const createRequestValidation = data => {
    const schema = Joi.object({
        description: Joi.string().required(),
        priority: Joi.string().required()
    });
};

const updateTestDateValidation = data => {
    const schema = Joi.object({
        testDate: Joi.date().required()
    });
};

const updateTestInfoValidation = data => {
    const schema = Joi.object({
        responsibleTechnicianId: Joi.string().required(),
        pdfFilePath: Joi.string().required(),
        result: Joi.boolean().required()
    });
};

module.exports.createRequestValidation = createRequestValidation;
module.exports.updateTestDateValidation = updateTestDateValidation;
module.exports.updateTestInfoValidation = updateTestInfoValidation;