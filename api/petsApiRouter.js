const express = require('express');
const router = express.Router();
const Persistence = require('../persistence/petsPersistence');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const write = util.promisify(fs.writeFile);
const persistenceInstance = new Persistence(readFile, write);
const Pet = require('../model/Pets');
const { CannotReadFile, NotFoundException } = require('../util/petsException');

router.use(express.json());




router.get('/pets', async (req, res) => {

    try {
        //let petList = await persistenceInstance.getAllPets();        
        return res.status(200).send(JSON.stringify("OIOIOIOIOOIOIOIO"));
    } catch (error) {
        return res.status(500).send(JSON.stringify(error.message));
    }
});

router.get('/pets/:id', async (req, res) => {
    try {
        let petFound = await persistenceInstance.getPetById(req.params.id);
        return res.status(200).send(petFound);
    } catch (error) {
        switch(error.constructor){
            case CannotReadFile: 
                return res.status(500).send(JSON.stringify(error.message));
            case NotFoundException: 
                return res.status(404).send(JSON.stringify(error.message));
        }                
    }
});

router.post('/pets', async (req, res) => {
    let pet = new Pet();
    pet.name = req.body.name;
    try {
        let result = await persistenceInstance.insertPet(pet);
        return res.status(200).send(result);
        
    } catch(error) {
        return res.status(500).send(JSON.stringify(error.message));
    }
});


router.put('/pets/:id', async (req, res) => {
    let pet = new Pet();
    pet.id = req.params.id;
    pet.name = req.body.name;
    try{
        let result = await persistenceInstance.updatePet(pet);
        return res.status(200).send(result);
    } catch(error) {
        switch (error.constructor) {
            case NotFoundException: 
                return res.status(404).send(JSON.stringify(error.message));
            case CannotReadFile: 
                return res.status(500).send(JSON.stringify(error.message));
        }                
    }
});


router.delete('/pets/:id', async (req, res) => {
    try{
        let result = await persistenceInstance.deletePet(req.params.id);
        res.status(200).send(result);
    } catch(error){
        switch (error.constructor) {
            case NotFoundException: 
                return res.status(404).send(JSON.stringify(error.message));
            case CannotReadFile: 
                return res.status(500).send(JSON.stringify(error.message));
        }
    }
});



module.exports = router;