const Joi = require('joi')

exports.registerSchema = Joi.object().keys({
    fullName: Joi.string().min(3).trim().pattern(/^\s*[A-Za-z ]+\s*$/).messages({
        'any.required': 'FullName is required',
        "string.empty": "FullName cannot be Empty",
"string.pattern.base":'Fullname should only contain alphabets',
'string.min':'Fullname should not be less than 3 letters'
    }).required(),
    email: Joi.string().email().trim().required().messages({
        'string.email':"invalid email format",
        "any.required":"Email is required",
         "string.empty": "Email cannot be Empty"
     }),
     password: Joi.string().pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/).min(6).trim().messages({
        "string.min":"password must be at least 6 characters",
        "any.required":"password is required",
         "string.empty": "password cannot be Empty",
         "string.pattern.base": 'password must be mininum of 8 character and include at least one Uppercase, lowercase and a special character [!!@#$%^&*]'
    }).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    }),
    username: Joi.string().min(3).required(),


   
 })
// exports.registerSchema = Joi.object().keys({
//     fullName: Joi.string().min(3).max(40).required(),
//     email: Joi.string().trim().email().required(),
//     password: Joi.string().required(),
//     confirmPassword: Joi.string().required().valid(Joi.ref('password')).required().messages({
//         'any.only': 'Passwords do not match',
//     }),
//     username: Joi.string().min(3).required(),


   
//  })



exports.loginSchema = Joi.object().keys({
    email: Joi.string().trim().email().optional(),
    password: Joi.string().required(),
    username: Joi.string().min(3).optional(),
}).or('email', 'username') 


exports.verificationEmailSchema = Joi.object().keys({
    email: Joi.string().trim().email().required(),


})


exports.forgotPasswordSchema = Joi.object().keys({
    email: Joi.string().trim().email().required(),


})



exports.resetPasswordschema = Joi.object().keys({
    password: Joi.string().pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/).min(6).trim().messages({
        "string.min":"password must be at least 6 characters",
        "any.required":"password is required",
         "string.empty": "password cannot be Empty",
         "string.pattern.base": 'password must be mininum of 8 character and include at least one Uppercase, lowercase and a special character [!!@#$%^&*]'
    }).required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
    })
})


exports.changePassword = Joi.object().keys({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    confirmPassword: Joi.string().required().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match',
    })
})
