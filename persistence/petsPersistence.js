const fs = require('fs');
const Pet = require('../model/Pets');

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
            console.log(error);
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
            return null;
        }
    }

    insertPet(pet){
        let petList = this.petListFile;
        pet.id = petList.length + 1;
        petList.push(pet);
        this.writeFile(petList);        
        return pet;
    }

    updatePet(pet){
        const petFound = this.findPetById(pet.id);
        if(!petFound) {
            return null;
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
            return null;
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
        var petsConverted = JSON.stringify(petList , null, 2);
        fs.writeFile('./db/pets.json', petsConverted, () =>{ console.log('all set')});
    }
}

module.exports = PetsPersistence;