const express = require('express');
const app = express();
const Persistence = require('../persistence/petsPersistence');
const persistenceInstance = new Persistence();
const Pet = require('../model/Pets');

app.use(express.json());
const PORT = process.env.PORT || 8080;

class PetsApi {

    constructor(){
        this.initializeRouters();     
        this.startServer();
    }

    initializeRouters(){
        app.get('/pets', (req, res) => {            
            let result = persistenceInstance.getAllPets();
            res.send(result);
        });
    
        app.get('/pets/:id', (req, res) => {
            let pet = new Pet();
            pet.id = req.params.id;
            let petFound = persistenceInstance.getPetById(pet.id);
            if(petFound != null){
                res.status(200).send(petFound);
            }else{
                res.status(404).send('Not Found');
            }
        });
    
        app.post('/pets', (req, res) => {
            let pet = new Pet();
            pet.name = req.body.name;
            let result = persistenceInstance.insertPet(pet);
            res.send(result);
        });
    
    
        app.put('/pets/:id', (req, res) => {
            let pet = new Pet();
            pet.id = req.params.id;
            pet.name = req.body.name;
            let result = persistenceInstance.updatePet(pet);
            if(result != null){
                res.send(result);
            }
            else{
                res.status(404).send('Not Found');
            }
        });
    
    
        app.delete('/pets/:id', (req, res) => {
            let result = persistenceInstance.deletePet(req.params.id);
            if(result != null){
                res.send(result);
            }else{
                res.status(404).send('Not Found');
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