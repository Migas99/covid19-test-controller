var express = require('express');
var router = express.Router();
var technicianController = require('../controllers/technician-controller');

router.get('/', technicianController.getAllTechnicians);
router.post('/', technicianController.createTechnician);

router.put('/:technicianId', technicianController.updateTechnician);
router.delete('/:technicianId', technicianController.deleteTechnician);

router.get('/:technicianId', technicianController.getByIdTechnician);

//router.get("/login", technicianController.verifyLogin);

module.exports = router;