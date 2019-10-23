const express = require('express');
const app = express();
const Persistence = require('../persistence/petsPersistence');
const persistenceInstance = new Persistence();
const Pet = require('../model/Pets');
const { CannotReadFile, NotFoundException } = require('../util/petsException');

app.use(express.json());
const PORT = process.env.PORT || 8080;

class PetsApi {

    constructor(){
        this.initializeRouters();     
        this.startServer();
    }

    initializeRouters(){
        app.get('/pets', (req, res) => {
            try {
                let result = persistenceInstance.getAllPets();
                res.send(result);
            } catch (error) {
                res.status(500).send(JSON.stringify(error.message));
            }            
        });
    
        app.get('/pets/:id', (req, res) => {
            try {               
                res.status(200).send(persistenceInstance.getPetById(req.params.id));
            } catch (error) {            
                switch(error.constructor){
                    case CannotReadFile: 
                        return res.status(500).send(JSON.stringify(error.message));
                    case NotFoundException: 
                        return res.status(404).send(JSON.stringify(error.message));
                }
            }
        });
    
        app.post('/pets', (req, res) => {
            try {
                let pet = new Pet();
                pet.name = req.body.name;
                let result = persistenceInstance.insertPet(pet);
                res.status(200).send(result);
            } catch (error) {
                return res.status(500).send(JSON.stringify(error.message));
            }            
        });
    
    
        app.put('/pets/:id', (req, res) => {
            try {
                let pet = new Pet();
                pet.id = req.params.id;
                pet.name = req.body.name;
                let result = persistenceInstance.updatePet(pet);
                res.status(200).send(result);                    
            } catch (error) {
                switch (error.constructor) {
                    case NotFoundException: 
                        return res.status(404).send(JSON.stringify(error.message));
                    case CannotReadFile: 
                        return res.status(500).send(JSON.stringify(error.message));
                }                
            }            
        });
    
    
        app.delete('/pets/:id', (req, res) => {
            try {
                let result = persistenceInstance.deletePet(req.params.id);                
                res.status(200).send(result);
            } catch (error) {
                switch (error.constructor) {
                    case NotFoundException: 
                        return res.status(404).send(JSON.stringify(error.message));
                    case CannotReadFile: 
                        return res.status(500).send(JSON.stringify(error.message));
                }
            }
        });
    }

    startServer(){
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
            console.log(`Tap CTRL+C to stop`);
        });
    }
}

module.exports = PetsApi;