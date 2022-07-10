const joi = require('joi')

const validator = (req, res, next) => {

    // console.log(req.body.data)

    const schema = joi.object({

        firstName: joi.string()
            .max(20) // max caracteres
            .min(3)
            .trim()
            .pattern(new RegExp('[a-zA-Z]')) // expresiones regulares
            // .required()
            .messages({
                'string.min': 'The name must have more than three letters',
                'string.max': 'The name must have less than twenty letters'
            }),

        lastName: joi.string()
            .max(20)
            .min(3)
            .trim()
            .pattern(new RegExp('[a-zA-Z]'))
            // .required()
            .messages({
                'string.min': 'The last name must have more than three letters',
                'string.max': 'The last name must have less than twenty letters'
            }),

        password: joi.string()
            .min(6)
            .trim()
            .required()
            .messages({
                'string.min': 'The password must have more than six letters',
            }),

        email: joi.string()
            .email({ minDomainSegments: 2 })
            .required()
            .messages({
                'string.email': 'Formato incorrecto de email'
            }),
        
        from: joi.string(),

        photoUrl: joi.string(),
        country: joi.string(),
        verification: joi.boolean(),
    })

    const validation = schema.validate(req.body, { abortEarly: false }) // oborte una vez que haya verificado todos los campos, no que me avise campo por campo ( hace 1 sola respuesta por cada vez que se equivoco en vez de dar una respuesta por cada equivocacion)

    if (validation.error) {

        return res.json({
            success: false,
            from: 'validator',
            message: validation.error.details,
            test: validation // revisar
        })
    }
    next() // le da paso al controlador
}

module.exports = validator