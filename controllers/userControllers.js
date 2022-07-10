const UserModel = require('../models/user') // importo mi modelo
const bcryptjs = require('bcryptjs')
const crypto = require('crypto') // importo crypo
const sendVerificationMail = require('../controllers/sendVerificationMail') // importo mi funcion de verificacion
const jwt = require('jsonwebtoken') // importo json web token


const userControllers = {

    signUpUser: async (req, res) => {

        const { firstName, lastName, email, password, photoUrl, country, from } = req.body;

        try {

            const userTrue = await UserModel.findOne({ email }) // buscamos por mail si el usuario existe en la base de datos
            const passEncrypted = bcryptjs.hashSync(password, 10); // encripto la pass
            const verification = false; // por defecto la verificacion la colocamos como false
            const uniqueString = crypto.randomBytes(15).toString('hex') //utilizo los métodos de crypto, codigo que se envia por mail para luego comparar con el de la base de datos y cambiar la verificacion


            if (!userTrue) { // si el usuario NO EXISTE

                const myNewUser = await new UserModel({
                    firstName,
                    lastName,
                    email,
                    password: [passEncrypted],
                    photoUrl,
                    country,
                    from: [from],
                    verification, // VERIFICACION
                    uniqueString: uniqueString // UNIQUE STRING
                })

                if (from === 'from-Signup') { // si se registra desde el FORMULARIO

                    await myNewUser.save()
                    await sendVerificationMail(email, uniqueString)

                    res.json({
                        success: true,
                        from: from,
                        message: `check ${email} and finish your SIGN UP!`
                    })

                } else { // si se registra desde alguna RED SOCIAL

                    myNewUser.verification = true //no es necesario que valide datos
                    await myNewUser.save()

                    res.json({
                        success: true,
                        from: from,
                        message: `you've just signed up by ${from}! now LOG IN!`
                    })

                }

            }

            else { // si el usuario EXISTE

                if (userTrue.from.indexOf(from) !== -1) { // si el indice del from es cualquier numero distinto de -1 significa que ya existe el usuario

                    res.json({
                        success: false,
                        from: from,
                        message: `${email} has been registered yet, please LOG IN!`
                    })

                } else { // si es -1 significa que el usuario NO SE REGISTRO DE ESTA FORMA (nuevo registro con google) pero ya tiene al menos un registro (facebook y form)

                    userTrue.password.push(passEncrypted)
                    userTrue.from.push(from)
                    userTrue.verification = true

                    await userTrue.save()

                    res.json({
                        success: true,
                        from: from,
                        message: `you are ready to SIGN UP!`
                    })

                }

            }

        }

        catch (error) {

            res.json({
                success: false,
                from: from,
                message: 'Something went wrong. Try again in a few seconds',
                console: console.log(error)
            })

        }

    },

    signInUser: async (req, res) => {

        const { email, password, from, photoUrl } = req.body // agregar imagen

        try {

            const loginUserTrue = await UserModel.findOne({ email }) //buscamos por email


            if (!loginUserTrue) { // si el usuario NO EXISTE

                res.json({
                    success: false,
                    from: 'no from',
                    message: `incorrect mail or password`
                })

            }

            else if (loginUserTrue.verification) { // si la verificacion del usuario EXISTE

                let comparePass = loginUserTrue.password.filter(pass => bcryptjs.compareSync(password, pass))

                if (from === 'from-Signup') { // si se registro mediante mi FORMULARIO

                    if (comparePass.length > 0) { // busca COINCIDENCIAS

                        const userData = { //objeto del TOKEN
                            id: loginUserTrue._id,
                            firstName: loginUserTrue.firstName,
                            lastName: loginUserTrue.lastName,
                            email: loginUserTrue.email,
                            photoUrl: loginUserTrue.photoUrl,
                            country: loginUserTrue.country,
                            from: loginUserTrue.from
                        }

                        await loginUserTrue.save()


                        const token = jwt.sign({ ...userData }, process.env.SECRET_KEY, { expiresIn: 60* 60*24 })
                        // creamos una firma con el metodo sign y le pasamos como payload mi objeto creado userData
                        // usa una variable de entorno que se va a utilizar para encriptar y desencriptar el token
                        // tiempo de expiracion del token
                        // console.log(token)

                        res.json({
                            response: { token, userData }, // mandamos al token al front
                            // response: { userData },
                            success: true,
                            from: from,
                            message: `welcome back ${userData.firstName}!`
                        })

                    } else { // si no encuentra COINCIDENCIAS

                        res.json({
                            success: false,
                            from: from,
                            message: `verify your password!`
                        })

                    }

                }

                else { // si se registro mediante REDES SOCIALES


                    if ( comparePass.length > 0 ) { // busca COINCIDENCIAS

                        const userData = { //objeto del TOKEN
                            id: loginUserTrue._id,
                            firstName: loginUserTrue.firstName,
                            lastName: loginUserTrue.lastName,
                            email: loginUserTrue.email,
                            photoUrl: loginUserTrue.photoUrl,
                            country: loginUserTrue.country,
                            from: loginUserTrue.from
                        }

                        await loginUserTrue.save()


                        const token = jwt.sign({ ...userData }, process.env.SECRET_KEY, { expiresIn: 60 * 60 * 24 })
                        // creamos una firma con el metodo sign y le pasamos como payload mi objeto creado userData
                        // usa una variable de entorno que se va a utilizar para encriptar y desencriptar el token
                        // tiempo de expiracion del token
                        // console.log(token)

                        res.json({
                            response: { token, userData },
                            // response: { userData },
                            success: true,
                            from: from,
                            message: `welcome back ${userData.firstName}!`
                        })

                    } else {

                        res.json({
                            success: false,
                            from: from,
                            message: `verify your mail or password!`
                        })

                    }

                }
            }

            else { // si el usuario esta registrado pero todavia no se VALIDO

                res.json({
                    success: false,
                    from: from,
                    message: `validate your account`
                })

            }

        }

        catch (error) {

            res.json({
                success: false,
                from: from,
                message: 'Something went wrong. Try again in a few seconds',
                console: console.log(error)
            })
        }

    },

    verifyMail: async (req, res) => {

        const { string } = req.params
        const user = await UserModel.findOne({ uniqueString: string }) // agarra por parametro el unique string y busca un usuario que coincida
        //console.log(user)
        if (user) {
            user.verification = true // si existe cambia la verificacion a true
            await user.save()
            res.redirect('http://localhost:3000/signin') // redirecciona el link del mail a donde quiera
        }
        else {
            res.json({
                success: false,
                message: `email has not account yet!`
            })
        }

    },


    verifyToken: async (req, res) => {

        if (req.user) {

            res.json({
                success: true,
                response:{

                    id: req.user.id,
                    firstName: req.user.firstName,
                    lastName: req.user.lastName,
                    email: req.user.email,
                    photoUrl: req.user.photoUrl,
                    country: req.user.country,
                    from: 'token'

                },
                message: `Welcome back ${req.user.firstName}`
            })
        }

        else {
            res.json({
                success: false,
                message: 'Pleace retry Sign In'
            })
        }

    },

}

module.exports = userControllers // exporto todos mis controladores para utilizar en mis rutas

