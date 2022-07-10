const mongoose = require('mongoose'); // lo requerimos porq necesitamos uno de sus metodos constructores

const tinerarySchema = new mongoose.Schema({ // constructor de esquemas
    city: { type: mongoose.Types.ObjectId, ref: 'cities' }, //relacion con otra coleccion
    tineraryName: { type: String, required: true }, // nombre del itinerario
    userPhoto: { type: String, required: true }, // foto del creador del itinerario
    userName: { type: String, required: true }, // nombre del creador del itinerario
    price: { type: String, required: true }, // precio
    time: { type: String, required: true }, // duracion
    hashtags: { type: Array, required: true }, // hashtags
    likes: { type: Array }, // likes
    comments: [{
        comment: { type: String },
        userID: { type: mongoose.Types.ObjectId, ref: 'users' },
    }],
    activity: { type: Array, required: true }, // actividades
})

const Tineraries = mongoose.model('tineraries', tinerarySchema); // se conecta con la coleccion tineraries de la base de datos en mongo, y se pasa por esquema lo que definimos

module.exports = Tineraries; // lo exportamos a controladores