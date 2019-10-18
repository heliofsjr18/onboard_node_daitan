const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

class PetsPersistence{
    
    constructor(){
        this.getFileData();
    }

    getFileData(){
         readFile('./db/pets.json').then(data => {
            this.pets = JSON.parse(data);
        }).catch(error => {
            console.log(error);
        });
    }


    getAll(){
        return this.pets;
    }

    getByid(id){
        let petFound = this.findPetById(id);
        if(petFound){
            return petFound;
        }else{
            return null;
        }
    }

    insertPet(petName){
        const newPet = { 
            id: this.pets.length + 1, 
            name: petName
        }
        this.pets.push(newPet);
        var petsConverted = JSON.stringify(this.pets , null, 2);
        fs.writeFile('./db/pets.json', petsConverted, () =>{ console.log('all set')});
        return newPet;
    }

    updatePet(id, name){
        const petFound = this.findPetById(id);
        if(!petFound) {
            return null;
        }
        else{
            petFound.name = name;
            let petsConverted = JSON.stringify(this.pets , null, 2);
            fs.writeFile('./db/pets.json', petsConverted, () =>{ console.log('all set')});
            return petFound;
        }
    }

    deletePet(petName){
        const petFound = this.findPetByName(petName);
        if(!petFound){  
            return null;
        }
        else{
            const index = this.pets.indexOf(petFound);    
            this.pets.splice(index, 1);
            let petsConverted = JSON.stringify(this.pets , null, 2);
            fs.writeFile('./db/pets.json', petsConverted, () =>{ console.log('all set')});
            return(petFound);
        }
    }

    findPetById(id){
        return this.pets.find(p => { return p.id == id});
    }

    findPetByName(name){
        return this.pets.find(p => { return p.name == name});
    }
}

module.exports = PetsPersistence;