const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

<<<<<<< HEAD
// ------------------- User Validation -------------------
const validateUser = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        age: Joi.number().required(),
        gender: Joi.string().min(4).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(50).required()
    });
    return schema.validate(data);
}

const validateUpdateUser = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        age: Joi.number().required(),
        gender: Joi.string().min(4).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        role: Joi.string().valid('ADMIN', 'USER', 'guest')
    });
    return schema.validate(data);
}

// ------------------- Auth Validation -------------------
const validateLogin = (data) => {
=======

const validateUser = ( data ) => {
    // create schema for expected json body
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(50).required()
    });
    // validate body based on schema
    const result = schema.validate(data);
    // return the result
    return result;
}

const validateUpdateUser = ( data ) => {
    // create schema for expected json body
    const schema = Joi.object({
        firstName: Joi.string().min(3).max(50).required(),
        lastName: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        role: Joi.string().valid('ADMIN', 'USER', 'guest')
        });
    // validate body based on schema
    const result = schema.validate(data);
    // return the result
    return result;
}


// Authentication related utilities
const validateLogin = ( data ) => {
    // create schema for expected json body
>>>>>>> 60571022a8105c030933491b28a8d3a0dbfd0f9b
    const schema = Joi.object({
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(255).required()
    });
<<<<<<< HEAD
    return schema.validate(data);
}

// ------------------- Post & Comment Validation -------------------
const validatePost = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        content: Joi.string().min(1).required()
    });
    return schema.validate(data);
}

const validateComment = (data) => {
    const schema = Joi.object({
        content: Joi.string().min(1).required()
    });
    return schema.validate(data);
}

// ------------------- Exports -------------------
module.exports = {
    validateUser,
    validateUpdateUser,
    validateLogin,
    validatePost,
    validateComment
};
=======
    // validate body based on schema
    const result = schema.validate(data);
    // return the result
    return result;
}

module.exports.validateUser = validateUser;
module.exports.validateUpdateUser = validateUpdateUser;
module.exports.validateLogin = validateLogin;
>>>>>>> 60571022a8105c030933491b28a8d3a0dbfd0f9b
