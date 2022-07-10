const mongoose = require('mongoose'); // lo requerimos porq necesitamos uno de sus metodos constructores

const activitySchema = new mongoose.Schema({ // constructor de esquemas
    name: { type: String, required: true },
    image: { type: String, required: true },
    itinerary: { type: mongoose.Types.ObjectId, ref: 'tineraries' }, // id del itinerario con el que quiera relacionar
    // description: { type: String, required: true },
})

const Activity = mongoose.model('activities', activitySchema); // se conecta con la coleccion cities de la base de datos en mongo, y se pasa por esquema lo que definimos

module.exports = Activity; // lo exportamos a controladores