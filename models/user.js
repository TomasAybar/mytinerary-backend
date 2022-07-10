const mongoose = require('mongoose'); // lo requerimos porq necesitamos uno de sus metodos constructores

const userSchema = new mongoose.Schema({ // constructor de esquemas
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: Array, required: true },
    photoUrl: { type: String },
    country: { type: String },
    from: { type: Array, required:true },
    uniqueString: { type: String, required: true },
    verification: { type: Boolean, required: true }
})

const User = mongoose.model('users', userSchema); // se conecta con la coleccion users de la base de datos en mongo, y se pasa por esquema lo que definimos

module.exports = User; // lo exportamos a controladores