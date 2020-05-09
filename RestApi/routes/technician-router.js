var express = require('express');
var router = express.Router();
var technicianController = require('../controllers/technician-controller');
var { authorizeBasedOnRoles, authorizeBasedOnRolesAndTechnicianId } = require('../middlewares/authorize');

router.post('/login', technicianController.login);
router.post('/register', technicianController.createTechnician);

router.get('/', authorizeBasedOnRoles(['ADMIN']), technicianController.getAllTechnicians);
router.put('/:technicianId', authorizeBasedOnRolesAndTechnicianId(['ADMIN']), technicianController.updateTechnician);
router.delete('/:technicianId', authorizeBasedOnRolesAndTechnicianId(['ADMIN']), technicianController.deleteTechnician);

router.get('/:technicianId', authorizeBasedOnRolesAndTechnicianId(['ADMIN']), technicianController.getByIdTechnician);
router.post('/logout', technicianController.logout);

module.exports = router;