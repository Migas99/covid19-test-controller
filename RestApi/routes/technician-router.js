var express = require('express');
var router = express.Router();
var technicianController = require('../controllers/technician-controller');

router.get('/', technicianController.getAllTechnicians);
router.post('/', technicianController.createTechnician);

router.get('/:technicianId', technicianController.getOneTechnician);
router.put('/:technicianId', technicianController.updateTechnician);
router.delete('/:technicianId', technicianController.deleteTechnician);

router.param('technicianId', technicianController.getByIdTechnician);

module.exports = router;