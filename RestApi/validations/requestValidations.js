//Validações
const Joi = require('@hapi/joi');

const createRequestValidation = data => {
    const schema = Joi.object({
        description: Joi.string().min(5).required()
    });
};

const updateRequestFirstTestDateValidation = data => {
    const schema = Joi.object({
        firstTestDate: Joi.date().required()
    });
};

const updateRequestFirstTestResultValidation = data => {
    const schema = Joi.object({
        firstTestFilePath: Joi.string().min(1).required(),
        firstResult: Joi.boolean().required()
    });
};

const updateRequestSecondTestDateValidation = data => {
    const schema = Joi.object({
        secondTestDate: Joi.date().required()
    });
};

const updateRequestSecondTestResultValidation = data => {
    const schema = Joi.object({
        secondTestFilePath: Joi.string().min(1).required(),
        secondResult: Joi.boolean().required()
    });
};

module.exports.createRequestValidation = createRequestValidation;
module.exports.updateRequestFirstTestDateValidation = updateRequestFirstTestDateValidation;
module.exports.updateRequestFirstTestResultValidation = updateRequestFirstTestResultValidation;
module.exports.updateRequestSecondTestDateValidation = updateRequestSecondTestDateValidation;
module.exports.updateRequestSecondTestResultValidation = updateRequestSecondTestResultValidation;