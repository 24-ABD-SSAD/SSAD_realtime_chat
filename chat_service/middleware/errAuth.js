const joi = require('joi')


const errAuth = ((err, req, res, next) => {

    if (err instanceof joi.ValidationError) return res.cc(err)

    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！', 401)

    res.cc(err)
})

module.exports = errAuth