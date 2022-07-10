const Router = require('express').Router();
const validator = require('../config/validator') // importo validator

const citiesControllers = require('../controllers/citiesControllers'); //importo mis controladores de cities
const tineraryControllers = require('../controllers/tineraryControllers'); //importo mis controladores de tineraries
const userControllers = require('../controllers/userControllers'); //importo mis controladores de user
const activityControllers = require('../controllers/activityControllers');
const commentControllers = require('../controllers/commentsControllers')


const { getCities, getOneCity, addCity, modifyCity, removeCity } = citiesControllers; // extraigo individualmente los controladores que tiene dentro cities
const { getTineraries, addTinerary, removeTinerary, getIinerariesFromOneCity, modifyTinerary, likeDislike, getOneTinerary } = tineraryControllers; // extraigo individualmente los controladores que tiene dentro cities
const { signUpUser, signInUser, verifyMail, verifyToken } = userControllers; // extraigo individualmente los controladores que tiene dentro cities
const { getActivities, addActivity, removeActivity, getActivitiesFromItinerary, getOneActivity, modifyActivity, } = activityControllers
const { addComment, removeComment, modifyComment } = commentControllers


const passport = require('../config/passport');

// COMMENTS
Router.route('/tineraries/comment')
    .post(passport.authenticate('jwt', { session: false }), addComment)
    .put(passport.authenticate('jwt', { session: false }), modifyComment)

Router.route('/tineraries/comment/:id')
    .post(passport.authenticate('jwt', { session: false }), removeComment)


// LIKES
Router.route('/tineraries/like/:id')
    .put(passport.authenticate('jwt', { session: false }), likeDislike)


// ACTIVITIES
Router.route('/activities')
    .get(getActivities)
    .post(addActivity)

Router.route('/activities/:id')
    .get(getOneActivity)
    .put(modifyActivity)
    .delete(removeActivity)

Router.route('/tinerariesActivities/:id')
    .get(getActivitiesFromItinerary)


// TOKEN
Router.route('/signinToken')
    .get(passport.authenticate('jwt', { session: false }), verifyToken) // atraves de header recibe


// CITIES
Router.route('/cities')
    .get(getCities) // traigo todas las ciudades que tengo cargadas
    .post(addCity)  // agrego ciudades en el body

Router.route('/cities/:id') // llamo a ciudades por su id
    .delete(removeCity) // controlador para remover una ciudad
    .put(modifyCity) // controlador para modificar una ciudad
    .get(getOneCity) // controlador para traer solo una ciudad


// TINERARIES
Router.route('/tinerary/:id')
    .get(getOneTinerary) // traigo solo un itinerario respecto al id

Router.route('/tineraries')
    .get(getTineraries) // traigo a todos mis itinerarios
    .post(addTinerary) // agrego itinerario por body

Router.route('/tineraries/:id')
    .delete(removeTinerary) // eliminar initeneario por id
    .get(getIinerariesFromOneCity) // traigo itinerarios respecto al id
    .put(modifyTinerary) // modificar itinerario


// SIGNUP
Router.route('/signup')
    .post(validator, signUpUser) // agrego un usuario a mi base de datos y le paso el validador


// SIGNIN
Router.route('/signin')
    .post(validator, signInUser)


// VERIFY MAIL
Router.route('/verify/:string')
    .get(verifyMail)


module.exports = Router // exporto para incluirlo en server.js