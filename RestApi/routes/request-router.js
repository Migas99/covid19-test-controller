const express = require('express');
const router = express.Router();
const requestController = require('../controllers/request-controller');
const { authorizeBasedOnRoles, authorizeBasedOnRolesAndUserId } = require('../middlewares/authorize');
const { uploadFile } = require('../middlewares/upload');

/*Obter todos os pedidos*/
router.get('/', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.getAllRequests);

/*Obter um pedido, usando o seu ID*/
router.get('/request/:requestId', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.getByIdRequest);

/*Obter todos os pedidos feitos por um user*/
router.get('/user/:userId', authorizeBasedOnRolesAndUserId(['TECHNICIAN', 'ADMIN']), requestController.getRequestsByUserId);

/*Obter todos os pedidos feitos pelo user requesitante*/
router.get('/myrequests', authorizeBasedOnRoles(['USER']), requestController.getRequestMadeByUser);

/*Método responsável por retornar a lista de testes ainda por tratar*/
router.get('/getIncompletedRequests/date', authorizeBasedOnRoles(['TECHNICIAN']), requestController.getTestsWithoutDates);

/*Método responsável por retornar a lista de pedidos por colocar o resultado, realizados pelo técnico*/
router.get('/getIncompletedRequests/result', authorizeBasedOnRoles(['TECHNICIAN']), requestController.getTestsWithoutResults);

/*Método responsável por retornar uma lista contendo os testes completos*/
router.get('/getCompletedRequests', authorizeBasedOnRoles(['TECHNICIAN']), requestController.getCompletedRequests);

/*Criar um novo pedido*/
router.post('/', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.createRequest);

/*Obter o número de testes realizados, dado um intervalo de datas*/
router.post('/date/count', authorizeBasedOnRoles(['TECHNICIAN', 'ADMIN']), requestController.getTestsBetweenDates);

/*Downlaod de um ficheiro associado a um teste*/
router.post('/download', authorizeBasedOnRoles(['USER', 'TECHNICIAN', 'ADMIN']), requestController.downloadFile);

/*Atualizar qualquer informação de um pedido*/
router.put('/:requestId', authorizeBasedOnRoles(['ADMIN']), requestController.updateRequest);

/*Atualizar a data de um teste associado a um pedido*/
router.put('/date/:requestId', authorizeBasedOnRoles(['TECHNICIAN']), requestController.updateRequestTestDate);

/*Atualizar o resultado de um teste associado a um pedido*/
router.put('/info/:requestId', authorizeBasedOnRoles(['TECHNICIAN']), uploadFile, requestController.updateRequestTestInfo);

/*Eliminar um pedido*/
router.delete('/:requestId', authorizeBasedOnRoles(['ADMIN']), requestController.deleteRequest);

module.exports = router;