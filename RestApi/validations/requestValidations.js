//Validações
const Joi = require('@hapi/joi');

const createRequestValidation = data => {
    const schema = Joi.object({
        description: Joi.string().required(),
        priority: Joi.string().required()
    });
    return schema.validate(data);
};

const updateTestDateValidation = data => {
    const schema = Joi.object({
        testDate: Joi.date().required()
    });
    return schema.validate(data);
};

const updateTestInfoValidation = data => {
    const schema = Joi.object({
        file: Joi.any().required(),
        result: Joi.boolean().required()
    });
    return schema.validate(data);
};

module.exports.createRequestValidation = createRequestValidation;
module.exports.updateTestDateValidation = updateTestDateValidation;
module.exports.updateTestInfoValidation = updateTestInfoValidation;