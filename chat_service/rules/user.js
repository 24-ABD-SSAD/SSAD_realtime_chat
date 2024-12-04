const joi = require('joi')

const email = joi.string().min(4).required().error(new Error('At least 4 characters'))
const code = joi.string().required().error(new Error('Verification code cannot be empty'))
const password = joi.string().min(6).required().error(new Error('Password must be at least 6 characters long'))
const timestamp = joi.number().min(10).required().error(new Error('The timestamp must be a significant number of 10'))

exports.reguserRule = {
    body: {
        email,
        code,
        password,
        timestamp
    }
}

exports.emailCodeRule = {
    body: {
        email
    }
}