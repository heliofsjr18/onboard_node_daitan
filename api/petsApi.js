const express = require('express');
const app = express();
const Persistence = require('../persistence/petsPersistence');
const persistenceInstance = new Persistence();
app.use(express.json());
const PORT = process.env.PORT || 8080;

class PetsApi {

    constructor(){
        this.initializeRouters();     
        this.startServer();
    }

    initializeRouters(){
        app.get('/pets', (req, res) => {            
            let pets = persistenceInstance.getAll();            
            res.send(pets);
        });
    
        app.get('/pets/:id', (req, res) => {
            let petFound = persistenceInstance.getByid(req.params.id);
            if(petFound != null){
                res.status(200).send(petFound);
            }else{
                res.status(404).send('Not Found');
            }
        });
    
        app.post('/pets', (req, res) => {
            let result = persistenceInstance.insertPet(req.body.name);
            res.status(200).send(result);
        });
    
    
        app.put('/pets/:id', (req, res) => {
            let result = persistenceInstance.updatePet(req.params.id, req.body.name);
            if(result != null){
                res.send(result);
            }
            else{
                res.status(404).send('Not Found');
            }
        });
    
    
        app.delete('/pets', (req, res) => {

            let result = persistenceInstance.deletePet(req.body.name);
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