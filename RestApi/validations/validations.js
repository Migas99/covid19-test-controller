//Validações
const Joi = require('@hapi/joi');

//Validar o login
const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
    });

    return schema.validate(data);
}

//Validar o registo de um user
const userRegisterValidation = data => {
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

//Validar o registo de um técnico
const technicianRegisterValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(6).required(),
        password: Joi.string().min(6).required(),
        fullName: Joi.string(),
        civilNumber: Joi.string(),
        address: Joi.string(),
        phoneNumber: Joi.number(),
        email: Joi.string().min(4).required().email(),
    });

    return schema.validate(data);
};

module.exports.loginValidation = loginValidation;
module.exports.userRegisterValidation = userRegisterValidation;
module.exports.technicianRegisterValidation = technicianRegisterValidation;