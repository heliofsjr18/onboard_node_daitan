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
        app.get('/pets', async (req, res) => {

            try {
                let petList = await persistenceInstance.getAllPets();
                return res.status(200).send(petList);
            } catch (error) {
                return res.status(500).send(JSON.stringify(error.message));
            }
        });
    
        app.get('/pets/:id', (req, res) => {
            return persistenceInstance.getPetById(req.params.id).then(petFound => {
                return res.status(200).send(petFound);
            }).catch(error => {
                switch(error.constructor){
                    case CannotReadFile: 
                        return res.status(500).send(JSON.stringify(error.message));
                    case NotFoundException: 
                        return res.status(404).send(JSON.stringify(error.message));
                }
            })
        });
    
        app.post('/pets', (req, res) => {
            let pet = new Pet();
            pet.name = req.body.name;
            return persistenceInstance.insertPet(pet).then(result => {
                return res.status(200).send(result);
            }).catch(error => {
                return res.status(500).send(JSON.stringify(error.message));
            });
        });
    
    
        app.put('/pets/:id', (req, res) => {
            let pet = new Pet();
            pet.id = req.params.id;
            pet.name = req.body.name;
            return persistenceInstance.updatePet(pet).then(result =>{
                return res.status(200).send(result);
            }).catch(error => {
                switch (error.constructor) {
                    case NotFoundException: 
                        return res.status(404).send(JSON.stringify(error.message));
                    case CannotReadFile: 
                        return res.status(500).send(JSON.stringify(error.message));
                }                
            });            
        });
    
    
        app.delete('/pets/:id', (req, res) => {
                persistenceInstance.deletePet(req.params.id).then(result => {
                    res.status(200).send(result);
                }).catch(error => {
                switch (error.constructor) {
                    case NotFoundException: 
                        return res.status(404).send(JSON.stringify(error.message));
                    case CannotReadFile: 
                        return res.status(500).send(JSON.stringify(error.message));
                }
            });
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