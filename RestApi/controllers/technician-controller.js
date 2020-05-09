var mongoose = require("mongoose");
var Technician = require("../models/technician");

var technicianController = {};

//CRIAR TECNICO
technicianController.createTechnician = async (req, res) => {
    var technician = new Technician(req.body);
    
    try{
        await technician.save();
        res.json(technician);
    }catch(err){
        res.json(err)
    }
};

//ATUALIZAR TECNICO
technicianController.updateTechnician = async (req, res) => {
    try{
        const updatedTechnician = await Technician.updateOne({_id: req.params.technicianId}, req.body);
    }catch(err){
        res.json(err);
    }
};

//APAGAR UM TECNICO
technicianController.deleteTechnician = async (req, res) => {
    try{
        const deletetedTechnician = await Technician.remove({_id: req.params.technicianId});
    }catch(err){
        res.json(err);
    }
};

//RECEBER TODOS OS TECNICOS
technicianController.getAllTechnicians = async (req, res) => {
    try {
        const technicians = await Technician.find();
        res.json(technicians);
    } catch (error) {
        res.json(err);
    }
};

//RECEBER TECNICO COM DETERMINADO ID
technicianController.getByIdTechnician = async (req, res) => {
    try{
        const technician = await Technician.findById(req.params.technicianId);
        res.json(technician);
    }catch(err){
        res.json(err)
    }
};

//VERIFICAR LOGIN DO TECNICO
technicianController.verifyLogin = async (req, res) =>{
    const technician = await technician.find (technician => technician.username = req.params.username);
    
    if(technician == null){
        res.send("technician not found");
    }else{
        if(technician.password == req.params.password){
            res.send("Sucess");
        }else{
            res.send("Password Incorrect");
        }
    }
};

module.exports = technicianController;