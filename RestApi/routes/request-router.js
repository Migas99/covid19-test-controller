var express = require('express');
var router = express.Router();
var requestController = require('../controllers/request-controller');
var { authorizeBasedOnRoles, authorizeBasedOnRolesAndUserId } = require('../middlewares/authorize');


router.get('/', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.getAllRequests);
router.post('/', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.createRequest);

router.put('/:requestId', authorizeBasedOnRoles(['ADMIN']), requestController.updateRequest);
router.put('/date/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.updateRequestTestDate);
router.put('/info/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.updateRequestTestInfo);

router.delete('/:requestId', authorizeBasedOnRoles(['ADMIN']), requestController.deleteRequest);

router.get('/:requestId', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.getByIdRequest);

router.get('/user/:userId', authorizeBasedOnRolesAndUserId(['TECHNICIAN', 'ADMIN']), requestController.getUserRequests);

module.exports = router;