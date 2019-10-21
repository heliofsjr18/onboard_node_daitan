const fs = require('fs');
const Pet = require('../model/Pets');

class PetsPersistence{
    
    constructor(){}

    getFileData(){
        try {
            let petList = [];
            let jsonPets = JSON.parse(fs.readFileSync('./db/pets.json', 'utf8'));
            jsonPets.map(pet => {
                let petObject = new Pet();
                petObject.setId(pet.id);
                petObject.setName(pet.name);
                petList.push(petObject);
            });
            return petList.sort((a, b) => {return a.id - b.id});
        } catch (error) {
            console.log(error);
        }
    }


    getAll(){
        let petList = this.getFileData();
        return petList;
    }

    getByid(pet){
        let petList = this.getFileData();
        let petFound = this.findPetById(petList, pet.id);
        if(petFound){
            return petFound;
        }else{
            return null;
        }
    }

    insertPet(pet){
        let petList = this.getFileData();
        const newPet = { 
            id: petList.length + 1, 
            name: pet.name
        }
        petList.push(newPet);
        this.writeFile(petList);        
        return newPet;
    }

    updatePet(pet){
        let petList = this.getFileData();
        const petFound = this.findPetById(petList, pet.id);
        if(!petFound) {
            return null;
        }
        else{
            petFound.name = pet.name;
            this.writeFile(petList);
            return petFound;
        }
    }

    deletePet(pet){
        let petList = this.getFileData();
        const petFound = this.findPetByName(petList, pet.name);
        if(!petFound){  
            return null;
        }
        else{
            const index = petList.indexOf(petFound);
            petList.splice(index, 1);
            this.writeFile(petList);
            return(petFound);
        }
    }

    findPetById(petList, id){
        return petList.find(p => { return p.id == id});
    }

    findPetByName(petList, name){
        return petList.find(p => { return p.name == name});
    }

    writeFile(petList){
        var petsConverted = JSON.stringify(petList , null, 2);
        fs.writeFile('./db/pets.json', petsConverted, () =>{ console.log('all set')});
    }
}

module.exports = PetsPersistence;