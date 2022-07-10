const TineraryModel = require('../models/tinerary');

const tineraryControllers = {

    // defino todos mis controladores

    getTineraries: async (req, res) => {
        let tinerary;
        let error = null;

        try {
            tinerary = await TineraryModel.find() // trae todos los itinerarios
                .populate('city')
        } catch (err) {
            error = err;
            console.log(error);
        }

        res.json({
            response: error ? 'ERROR' : tinerary,
            success: error ? false : true,
            error: error
        })
    },

    getOneTinerary: async (req, res) => {
        const id = req.params.id;
        let tinerary;
        let error = null;

        try {
            tinerary = await TineraryModel.findOne({ _id: id })
                .populate('comments.userID', { firstName: 1, lastName: 1, photoUrl: 1 })
        } catch (err) {
            error = err;
            console.log(error);
        }

        res.json({
            response: error ? 'ERROR' : tinerary,
            success: error ? false : true,
            error: error
        })
    },

    getIinerariesFromOneCity: async (req, res) => {
        const id = req.params.id;
        let tinerary;
        let error = null;
        try {
            tinerary = await TineraryModel.find({ city: id })
                .populate('comments.userID', { firstName: 1, lastName: 1, photoUrl: 1 })
        } catch (err) {
            error = err;
            console.log(error);
        }

        res.json({
            response: error ? 'ERROR' : tinerary,
            success: error ? false : true,
            error: error
        })
    },

    addTinerary: async (req, res) => {
        const { tineraryName, city, userPhoto, userName, price, time, hashtags, likes, activity } = req.body.data;

        let newTinerary;
        let error = null;

        try {
            newTinerary = await new TineraryModel({
                tineraryName,
                city,
                userPhoto,
                userName,
                price,
                time,
                hashtags,
                likes,
                activity,

            }).save()
        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : newTinerary,
            success: error ? false : true,
            error: error
        })
    },

    removeTinerary: async (req, res) => {
        const id = req.params.id;
        let tinerary;
        let error = null;

        try {
            tinerary = await TineraryModel.findOneAndDelete({ _id: id })
        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : tinerary,
            success: error ? false : true,
            error: error
        })
    },

    modifyTinerary: async (req, res) => {
        const id = req.params.id;
        const tinerary = req.body.data;

        let tineraryDB;
        let error = null;

        try {
            tineraryDB = await TineraryModel.findOneAndUpdate( // buscamos el objeto que coincida con el id, le pasamos por parametro lo que traigo del body y el id y le pido que me devuelva el nuevo
                { _id: id }, tinerary, { new: true } //ID: para encontrar el modelo, CITY: modificacion que vamos a pasar al body, 
                //true: cambia el modelo viejo por el actualizado, si fuera false, crea un modelo nuevo con la modificacion
            )
        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : tineraryDB,
            success: error ? false : true,
            error: error
        })
    },

    likeDislike: async (req, res) => {
        const id = req.params.id //LLEGA POR PARAMETRO DESDE AXIOS
        const user = req.user.id //LLEGA POR RESPUESTA DE PASSPORT

        await TineraryModel.findOne({ _id: id }) // se le pasa el id del itinerario

            .then(tinerary => {

                if (tinerary.likes.includes(user)) {
                    TineraryModel.findOneAndUpdate({ _id: id }, { $pull: { likes: user } }, { new: true })//PULL SACA
                        .then(response => res.json({ success: true, response: response.likes, messagge: 'dislike 👎' }))
                        .catch(error => console.log(error))
                } else {
                    TineraryModel.findOneAndUpdate({ _id: id }, { $push: { likes: user } }, { new: true })//PUSH AGREGA
                        .then(response => res.json({ success: true, response: response.likes, messagge: 'like 👍' }))
                        .catch(error => console.log(error))
                }
            })
            .catch((error) => res.json({ success: false, response: error }))
    },
}

module.exports = tineraryControllers // exporto mis controladores para usarlos en routes