//Validações
const Joi = require('@hapi/joi');

//Validar o registo
const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        fullName: Joi.string(),
        email: Joi.string().min(4).required().email(),
        birthDate: Joi.date(),
        civilNumber: Joi.string()
    });

    return schema.validate(data);
};

//Validar o login
const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;