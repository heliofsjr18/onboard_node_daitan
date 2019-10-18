const express = require('express');
const fs = require('fs');
const util = require('util');
const app = express();

app.use(express.json());

var readFile = util.promisify(fs.readFile);
var pets;

async function getFileData(){
    try {
         data = await readFile('./pets.json');
         pets = JSON.parse(data);
    } catch (error) {
        throw error;
    }
}


app.get('/pets', (req, res) => {
    res.send(pets);
});

app.get('/pets/:id', (req, res) => {
    const petFound = pets.find(p => { return p.id === parseInt(req.params.id)});
    if(petFound){
        res.status(200).send(petFound);
    }else{
        res.status(404).send('Not Found');
    }
    
});

app.post('/pets', (req, res) => {
    const newPet = { 
        id: pets.length + 1, 
        name: req.body.name
    }
    pets.push(newPet);
    var petsConverted = JSON.stringify(pets , null, 2);
    fs.writeFile('./pets.json', petsConverted, () =>{ console.log('all set')});
    res.status(200).send(pets);
});


app.put('/pets/:id', (req, res) => {
    const petFound = pets.find(p => {return p.id === parseInt(req.params.id)});
    if(!petFound) {
        res.status(404).send('Not Found');
    }
    else{
        petFound.name = req.body.name;
        var petsConverted = JSON.stringify(pets , null, 2);
        fs.writeFile('./pets.json', petsConverted, () =>{ console.log('all set')});
        res.send(pets);
    }
});


app.delete('/pets', (req, res) => {
    const petFound = pets.find(p => {return p.name === req.body.name});
    if(!petFound){  
        res.status(404).send('Not Found');
    }
    else{
        const index = pets.indexOf(petFound);    
        pets.splice(index, 1);
        var petsConverted = JSON.stringify(pets , null, 2);
        fs.writeFile('./pets.json', petsConverted, () =>{ console.log('all set')});
        res.send(petFound);
    }
});

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`Tap CTRL+C to stop`);
    getFileData();
});
