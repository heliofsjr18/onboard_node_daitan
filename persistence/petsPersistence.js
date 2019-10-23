const fs = require('fs');
const Pet = require('../model/Pets');
const { CannotReadFile, NotFoundException } = require('../util/petsException');

class PetsPersistence{
    
    constructor(){
        this.getFileData();
    }

    getFileData(){
        try {            
            let jsonPets = JSON.parse(fs.readFileSync('./db/pets.json', 'utf8'));
            this.petListFile = jsonPets.map(pet => {
                let objeto = new Pet();
                objeto.id = pet.id;
                objeto.name = pet.name;
                return objeto;
            }).sort((a, b) => {return a.id - b.id});
        } catch (error) {
            throw new CannotReadFile();
        }
    }


    getAllPets(){
        this.getFileData();
        return this.petListFile;
    }

    getPetById(id){
        let petFound = this.findPetById(id);
        if(petFound){
            return petFound;
        }else{
            throw new NotFoundException();
        }            
    }

    insertPet(pet){
        try {
            let petList = this.petListFile;
            pet.id = petList.length + 1;
            petList.push(pet);
            this.writeFile(petList);        
            return pet;            
        } catch (error) {
            throw error;
        }
    }

    updatePet(pet){
        const petFound = this.findPetById(pet.id);
        if(!petFound) {
            throw new NotFoundException();
        }
        else{
            petFound.name = pet.name;
            this.writeFile(this.petListFile);
            return petFound;
        }
    }

    deletePet(id){
        let petFound = this.findPetById(id);
        if(!petFound){  
            throw new NotFoundException();
        }
        else{
            const index = this.petListFile.indexOf(petFound);
            this.petListFile.splice(index, 1);
            this.writeFile(this.petListFile);
            return(petFound);
        }
    }

    findPetById(petId){
        return this.petListFile.find(p => { return p.id == petId});
    }

    findPetByName(petName){
        return this.petListFile.find(p => { return p.name == petName});
    }

    writeFile(petList){
        try {
            var petsConverted = JSON.stringify(petList , null, 2);
            fs.writeFileSync('./db/pets.json', petsConverted);            
        } catch (error) {
            throw new CannotReadFile();
        }
    }
}

module.exports = PetsPersistence;