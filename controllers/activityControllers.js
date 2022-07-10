const ActivityModel = require('../models/activity');

const activityControllers = {

    getActivities: async (req, res) => {
        let activities;
        let error = null;

        try {
            activities = await ActivityModel.find()
                .populate('itinerary')
        } catch (err) {
            error = err;
            console.log(error)
        }

        res.json({
            response: error ? 'ERROR' : activities,
            success: error ? false : true,
            error: error
        })
    },

    addActivity: async (req, res) => {
        const { name, image, itinerary } = req.body.data;

        let newActivity;
        let error = null;

        try {
            newActivity = await new ActivityModel({
                name,
                image,
                itinerary
            }).save()
        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : newActivity,
            success: error ? false : true,
            error: error
        })

    },

    removeActivity: async (req, res) => {
        const id = req.params.id;
        let activity;
        let error = null;

        try {
            activity = await ActivityModel.findOneAndDelete(
                { _id: id }
            )
        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : activity,
            success: error ? false : true,
            error: error
        })
    },

    getActivitiesFromItinerary: async (req, res) => {
        const id = req.params.id;
        let activity;
        let error = null;

        try {
            activity = await ActivityModel.find({itinerary: id});
        } catch (err) {
            error = err;
            console.log(error)
        }

        res.json({
            response: error ? 'ERROR' : activity,
            success: error ? false : true,
            error: error
        })
    },

    getOneActivity: async (req, res) => {

        const id = req.params.id;
        let activity;
        let error = null;

        try {
            activity = await ActivityModel.findOne({ _id: id })
        } catch (err) {
            error = err;
            console.log(error)
        }

        res.json({
            response: error ? 'ERROR' : activity,
            success: error ? false : true,
            error: error
        })
    },

    modifyActivity: async (req, res) => {
        const id = req.params.id;
        const activity = req.body;

        let activityDB;
        let error = null;

        try {
            activityDB = await ActivityModel.findOneAndUpdate(
                { _id: id }, activity, { new: true }
            )

        } catch (err) {
            error = err;
        }

        res.json({
            response: error ? 'ERROR' : activityDB,
            success: error ? false : true,
            error: error
        })
    },

}
module.exports = activityControllers; // exporto a rutas