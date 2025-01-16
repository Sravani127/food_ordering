const mongoose = require('mongoose');

const WorkTrackingSchema = new mongoose.Schema({
    user_id:{
        type:String,
    },
    clockIn: {
        type: String,
    },
    clockOut: {
        type: String,
    },
    totalHours: {
        type: String,
    },
    date: {
        type: String,
    },
    salaryPerHour: {
        type: String,
    },
    salary: {
        type: String,
    },
    bonus: {
        type: String,
    },
});

const WorkTrack = mongoose.model('WorkTrack', WorkTrackingSchema);

module.exports = WorkTrack;
