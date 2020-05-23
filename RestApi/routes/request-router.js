const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request-controller');
const { authorizeBasedOnRoles, authorizeBasedOnRolesAndUserId } = require('../middlewares/authorize');
const { uploadFile } = require('../middlewares/upload');

/*Obter todos os pedidos*/
router.get('/', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.getAllRequests);

/*Obter um pedido, usando o seu ID*/
router.get('/:requestId', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.getByIdRequest);

/*Obter todos os pedidos feitos por um user*/
router.get('/user/:userId', authorizeBasedOnRolesAndUserId(['TECHNICIAN', 'ADMIN']), requestController.getUserRequests);

/*Criar um novo pedido*/
router.post('/', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.createRequest);

/*Obter o número de testes realizados, dado um intervalo de datas*/
router.post("/date", authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.getTestsBetweenDates);

/*Atualizar qualquer informação de um pedido*/
router.put('/:requestId', authorizeBasedOnRoles(['ADMIN']), requestController.updateRequest);

/*Atualizar a data de um teste associado a um pedido*/
router.put('/date/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.updateRequestTestDate);

/*Atualizar o resultado de um teste associado a um pedido*/
router.put('/info/:requestId', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), uploadFile, requestController.updateRequestTestInfo);

/*Eliminar um pedido*/
router.delete('/:requestId', authorizeBasedOnRoles(['ADMIN']), requestController.deleteRequest);

module.exports = router;