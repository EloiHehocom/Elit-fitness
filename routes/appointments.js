const express = require('express');
const router = express.Router();
const deleteAppointment = require('../services/highlevel/appointments/delete');

// POST /appointments/delete
router.post('/delete/:eventId', async (req, res) => {
    const { eventId } = req.params;
  
    if (!eventId) {
      return res.status(400).json({ error: 'eventId manquant dans l’URL' });
    }
  
    try {
      const result = await deleteAppointment(eventId);
      return res.status(200).json({ message: 'Rendez-vous supprimé avec succès', result });
    } catch (error) {
      return res.status(500).json({ error: 'Erreur lors de la suppression', details: error.message });
    }
  });
  
  module.exports = router;