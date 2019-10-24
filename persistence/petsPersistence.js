const fs = require('fs');
const Pet = require('../model/Pets');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const write = util.promisify(fs.writeFile);
const { CannotReadFile, NotFoundException } = require('../util/petsException');

class PetsPersistence{


    getFileData(){        
        return readFile('./db1/pets.json', 'utf8').then(res => {
            return JSON.parse(res);
        }).then(res => {
            return res.map(pet => {
                return new Pet(pet.name, pet.id);
            })
        }).then(petList => {
            return petList.sort((a, b) => {return a.id - b.id});
        }).catch(error => {
            throw new CannotReadFile();
        });
    }


    async getAllPets(){
        return this.getFileData().then(res =>{
            return res;
        }).catch(error => {
            throw error
        });
    }

    getPetById(id){
        return this.getFileData().then(petList => {
            return this.findPetById(petList, id);
        }).catch(error => {
            throw error;
        });
    }

    insertPet(pet){
        return this.getFileData().then(petList => {
            pet.id = petList.length +1;
            petList.push(pet);
            return this.writeFile(petList).then(res => {
                return pet;
            }).catch(error => {
                throw error;
            });
        }).catch(error => {
            throw error;
        });
    }

    updatePet(pet){
        return this.getFileData().then(petList => {
            let petFound = this.findPetById(petList, pet.id);
            petFound.name = pet.name;                
            return this.writeFile(petList).then(result => {
                return petFound;
            }).catch(error => {
                throw error;
            })
        }).catch(error => {
            throw error;
        })
    }

    deletePet(id){
        return this.getFileData().then(petList => {
            let petFound = this.findPetById(petList, id);
            let index = petList.indexOf(petFound);
            petList.splice(index, 1);
            return this.writeFile(petList).then(result => {
                return petFound;
            }).catch(error => {
                throw error;
            });                
        }).catch(error => {
            throw error;
        });
    }

    findPetById(petList, petId){
        let petFound = petList.find(p => { return p.id == petId});
        if(petFound) {return petFound;}
        else {throw new NotFoundException();}
    }

    writeFile(petList){
        let petsConverted = JSON.stringify(petList , null, 2);
        return write('./db/pets.json', petsConverted).then(res => {
            return res;
        }).catch(error => {
            throw new CannotReadFile();
        });
    }
}

module.exports = PetsPersistence;