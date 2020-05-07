var express = require('express');
var router = express.Router();
var requestController = require('../controllers/request-controller');

router.get('/', requestController.getAllRequests);
router.post('/', requestController.createRequest);

router.get('/:requestId', requestController.getOneRequest);
router.put('/:requestId', requestController.updateRequest);
router.delete('/:requestId', requestController.deleteRequest);

//router.param('username', requestController.getAllRequestsFromUser);
router.param('requestId', requestController.getByIdRequest);

module.exports = router;