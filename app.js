const express = require('express');
const app = express();

app.use(express.json());

var pets = [
    {
        "id":1,
        "name": "dog"
    },
    {
        "id":2,
        "name": "cat"
    },
    {
        "id":3,
        "name": "bird"
    }
];

app.get('/pets', (req, res) => {
    res.status(200).send(pets);
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
    res.status(200).send(pets);
});


app.put('/pets/:id', (req, res) => {
    const petFound = pets.find(p => {return p.id === parseInt(req.params.id)});
    if(!petFound) res.status(204).send('Not Found');

    petFound.name = req.body.name;

    res.send(pets);
});


app.delete('/pets', (req, res) => {
    const petFound = pets.find(p => {return p.name === req.body.name});
    if(!petFound) res.status(204).send('Not Found');
    
    const index = pets.indexOf(petFound);    
    pets.splice(index, 1);
    res.send(petFound);
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
    console.log(`Tap CTRL+C to stop`);
});
