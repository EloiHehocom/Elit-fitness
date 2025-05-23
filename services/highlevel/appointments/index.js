const { getAllAppointments, getAppointment } = require('./get');
const createAppointment = require('./create');
const updateAppointment = require('./update');
const deleteAppointment = require('./delete');

module.exports = {
    getAllAppointments,
    getAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment
};