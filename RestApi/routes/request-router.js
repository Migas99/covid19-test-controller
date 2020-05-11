var express = require('express');
var router = express.Router();
var requestController = require('../controllers/request-controller');
var { authorizeBasedOnRoles, authorizeBasedOnRolesAndUserId } = require('../middlewares/authorize');


router.get('/', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.getAllRequests);
router.post('/', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.createRequest);

router.put('/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.updateRequest);
router.put('/firstdate/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.updateRequestFirstTestDate);
router.put('/firstresult/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.updateRequestFirstTestResult);
router.put('/seconddate/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.updateRequestSecondTestDate);
router.put('/secondresult/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.updateRequestSecondTestResult);

router.delete('/:requestId', authorizeBasedOnRoles(['ADMIN']), requestController.deleteRequest);

router.get('/:requestId', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.getByIdRequest);

router.get('/user/:userId', authorizeBasedOnRolesAndUserId(['TECHNICIAN', 'ADMIN']), requestController.getUserRequests);

module.exports = router;