const CityModel = require('../models/city');

const citiesControllers = {

    // defino todos mis controladores

    getCities: async (req, res) => {
        let cities;
        let error = null;

        try {
            cities = await CityModel.find() // trae todo lo que esta en el modelo
        } catch (err) {
            error = err;
            console.log(error);
        }

        res.json({
            response: error ? 'ERROR' :  cities,
            success: error ? false : true,
            error: error
        })
    },

    getOneCity: async (req, res) => {
        const id = req.params.id;
        let city;
        let error = null;

        try {
            city = await CityModel.findOne({ _id: id }) // busca a traves del id
        } catch (err) {
            error = err;
            console.log(error);
        }

        res.json({
            response: error ? 'ERROR' :  city,
            success: error ? false : true,
            error: error
        })
    },

    addCity: async (req, res) => {
        const { continent, city, country, description, population, image } = req.body.data // le pasamos los datos por body en postmans

        let newCity;
        let error = null;

        try {
            newCity = await new CityModel({ // crea una nueva instacia de city y lo va a guardar
                continent: continent,
                city: city,
                country: country,
                description: description,
                population: population,
                image: image,
            }).save()
        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : newCity,
            success: error ? false : true,
            error: error
        })

    },

    modifyCity: async (req, res) => {
        const id = req.params.id;
        const city = req.body.data;

        let cityDB;
        let error = null;

        try {
            cityDB = await CityModel.findOneAndUpdate( // buscamos el objeto que coincida con el id, le pasamos por parametro lo que traigo del body y el id y le pido que me devuelva el nuevo
                { _id: id }, city, { new: true } //ID: para encontrar el modelo, CITY: modificacion que vamos a pasar al body, 
                //true: cambia el modelo viejo por el actualizado, si fuera false, crea un modelo nuevo con la modificacion
            )
        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : cityDB,
            success: error ? false : true,
            error: error
        })
    },

    removeCity: async (req, res) => {
        const id = req.params.id;
        let city;
        let error = null;

        try {
            city = await CityModel.findOneAndDelete(
                { _id: id }
            )
        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : city,
            success: error ? false : true,
            error: error
        })
    },
}

module.exports = citiesControllers; // exporto todos mis controladores para utilizar en mis rutas