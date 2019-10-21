const express = require('express');
const app = express();
const Business = require('../business/business');
const businessInstance = new Business();
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
            let result = businessInstance.getAllPets();
            let pets = [];
            result.map(data => {
                let pet = new Pet();
                pet.setId(data.id);
                pet.setName(data.name);
                pets.push(pet);
            });
            res.send(pets);
        });
    
        app.get('/pets/:id', (req, res) => {
            let pet = new Pet();
            pet.setId(req.params.id)
            let petFound = businessInstance.getPetById(pet);
            if(petFound != null){
                res.status(200).send(petFound);
            }else{
                res.status(404).send('Not Found');
            }
        });
    
        app.post('/pets', (req, res) => {
            let pet = new Pet();
            pet.setName(req.body.name);
            let result = businessInstance.insertPet(pet);
            res.status(200).send(result);
        });
    
    
        app.put('/pets/:id', (req, res) => {
            let pet = new Pet();
            pet.setId(req.params.id);
            pet.setName(req.body.name);
            let result = businessInstance.updatePet(pet);
            if(result != null){
                res.send(result);
            }
            else{
                res.status(404).send('Not Found');
            }
        });
    
    
        app.delete('/pets', (req, res) => {
            let pet = new Pet();
            pet.setName(req.body.name);
            let result = businessInstance.deletePet(pet);
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