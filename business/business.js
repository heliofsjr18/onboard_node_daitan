const Joi = require('@hapi/joi');
const Persistence = require('../persistence/petsPersistence');
const persistenceInstance = new Persistence();
const regex = new RegExp(/^[a-zA-Z]*$/);

const schema = Joi.object({    
    petName: Joi.string().pattern(regex).min(3).max(15).required()
});

class Business{
    
    constructor(){}

    insertPet(pet){
        let result = this.validateInput(pet.name);
        if(result.error) return result.error.message;
        return persistenceInstance.insertPet(pet);
    }

    updatePet(pet){
        let result = this.validateInput(pet.name);
        if(result.error) return result.error.message;
        return persistenceInstance.updatePet(pet);
    }

    deletePet(pet){
        let result = this.validateInput(pet.name);
        if(result.error) return result.error.message;
        return persistenceInstance.deletePet(pet);
        
    }
    getAllPets(){
        return persistenceInstance.getAll();
    }
    getPetById(pet){
        return persistenceInstance.getByid(pet);
    }

    validateInput(name){
        return schema.validate({petName: name});
    }
}

module.exports = Business;