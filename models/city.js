const mongoose = require('mongoose'); // lo requerimos porq necesitamos uno de sus metodos constructores

const citySchema = new mongoose.Schema({ // constructor de esquemas
    continent: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    population: { type: Number, required: true },
    image: { type: String, required: true }
})

const City = mongoose.model('cities', citySchema); // se conecta con la coleccion cities de la base de datos en mongo, y se pasa por esquema lo que definimos

module.exports = City; // lo exportamos a controladores