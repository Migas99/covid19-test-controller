//Validações
const Joi = require('@hapi/joi');

//Validar o login
const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    });

    return schema.validate(data);
}

//Validar o registo de um user
const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        fullName: Joi.string().required(),
        gender: Joi.string().required(),
        birthDate: Joi.date(),
        civilNumber: Joi.string(),
        phoneNumber: Joi.number().required(),
        email: Joi.string().required().email(),
        address: Joi.string().required()
    });

    return schema.validate(data);
};

const updateValidation = data => {
    const schema = Joi.object({
        password: Joi.string().min(6),
        phoneNumber: Joi.number(),
        email: Joi.string().email(),
        address: Joi.string()
    });

    return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
module.exports.updateValidation = updateValidation;