const joi = require('joi')

exports.registerSchema = joi.object().keys({
    fullName: joi.string().min(3).max(40).required(),
    email: joi.string().trim().email().required(),
    password: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    }),
    username: joi.string().min(3).required(),


   
})


exports.loginSchema = joi.object().keys({
    email: joi.string().trim().email().optional(),
    password: joi.string().required(),
    username: joi.string().min(3).optional(),
}).or('email', 'username') 


exports.verificationEmailSchema = joi.object().keys({
    email: joi.string().trim().email().required(),


})


exports.forgotPasswordSchema = joi.object().keys({
    email: joi.string().trim().email().required(),


})



exports.resetPasswordschema = joi.object().keys({
    password: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    })
})


exports.changePassword = joi.object().keys({
    oldPassword: joi.string().required(),
    newPassword: joi.string().required(),
    confirmPassword: joi.string().required().valid(joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match',
    })
})
