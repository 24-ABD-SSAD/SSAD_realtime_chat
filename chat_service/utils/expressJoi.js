const Joi = require('joi')

const expressJoi = function (schemas, options = {strict: false}) {

    if (!options.strict) {

        options = {allowUnknown: true, stripUnknown: true, ...options}
    }

    delete options.strict

    return function (req, res, next) {
        try {
            ['body', 'query', 'params'].forEach(key => {

                if (!schemas[key]) return

                const schema = Joi.object(schemas[key])
                const {error, value} = schema.validate(req[key], options)

                if (error) {
                    throw error
                } else {

                    req[key] = value
                }
            })
            next()
        } catch (error) {
            res.cc(error)
        }

    }
}

module.exports = expressJoi
