const mongoose = require('mongoose') // libreria que me da funciones para poder conectarme a mi base de datos

mongoose.connect(process.env.MONGO, { // connect lleva dos parametros, uri de conexion que proporciona mongo y un objeto con dos propiedades
    useUnifiedTopology: true, //habilita usar el ultimo motor de mongo como predeterminado
    useNewUrlParser: true, //si no funciona el topology, que use el anterior
})

.then(() => console.log('Database connected') )
.catch(err => console.log(err) )