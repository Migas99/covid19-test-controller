var express = require('express');
var router = express.Router();
var requestController = require('../controllers/request-controller');


router.get('/', requestController.getAllRequests);
router.post('/', requestController.createRequest);

//NAO FAZ SENTIDO
//router.get('/:requestId', requestController.getOneRequest);


router.put('/:requestId', requestController.updateRequest);
router.delete('/:requestId', requestController.deleteRequest);

router.get('/:requestId', requestController.getByIdRequest);

router.get('/user/:username', requestController.getUserRequests);

module.exports = router;