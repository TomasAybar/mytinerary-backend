const TineraryModel = require('../models/tinerary');

const commentControllers = {


    addComment: async (req, res) => {
        const { tineraryID, comment } = req.body.data // id del itinerario y comentario
        const userID = req.user._id
        
        try {
            const nuevoComment = await TineraryModel.findOneAndUpdate({ _id: tineraryID }, { $push: { comments: { comment: comment, userID: userID } } }, { new: true }).populate('comments.userID', { firstName: 1, lastName: 1, photoUrl: 1 })
            res.json({ success: true, response: { nuevoComment }, messagge: 'Comment added' })

        }
        catch (error) {
            console.log(error)
            res.json({ success: false, messagge: 'Algo a salido mal intentalo en unos minutos' })
        }

    },

    removeComment: async (req, res) => {
        const id = req.params.id // recibe id por parametro

        try {
            const deleteComment = await TineraryModel.findOneAndUpdate({ 'comments._id': id }, { $pull: { comments: { _id: id } } }, { new: true })
            // console.log(deleteComment)
            res.json({ success: true, response: { deleteComment }, messagge: 'Comment deleted' })

        }
        catch (error) {
            console.log(error)
            res.json({ success: false, messagge: 'Algo a salido mal intentalo en unos minutos' })
        }

    },

    modifyComment: async (req, res) => {
        const { commentID, comment } = req.body.data // id del comentario y comentario nuevo

        try {
            const newComment = await TineraryModel.findOneAndUpdate({ 'comments._id': commentID }, { $set: { 'comments.$.comment': comment } }, { new: true })
            // console.log(newComment)
            res.json({ success: true, response: { newComment }, messagge: 'Modified comment' })

        }
        catch (error) {
            console.log(error)
            res.json({ success: true, messagge: 'Algo a salido mal intentalo en unos minutos' })
        }

    },
}

module.exports = commentControllers // exporto mis controladores para usarlos en routes