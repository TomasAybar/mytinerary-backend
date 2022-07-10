const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy //que voy a hacer con el token == variacion de passport que se usan para desencriptar passports de 
const extractJwt = require('passport-jwt').ExtractJwt // realizo la extraccion

const userModel = require('../models/user')

module.exports = passport.use(new jwtStrategy({ // usa una nueva estrategia y define un objeto donde va a capturar el token y lo va a extraer desde la autorizacion de bearer

    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(), // extrae la primera parte del token
    secretOrKey: process.env.SECRET_KEY

}, (jwt_payload, done) => {

    // console.log(jwt_payload)

    userModel.findOne({ _id: jwt_payload.id })

        .then(user => {

            // console.log(user)

            if (user) {
                return done(null, user)
            }

            else if (err) {
                console.log(err)
                return done(err, false);
            }

            else {
                return done(null, false)
            }
        })
        .catch(err => {
            console.log(err)
            return done(err, false)
        })

}))