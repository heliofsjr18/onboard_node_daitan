const petsPersistence = require('./petsPersistence');
const Pet = require('../model/Pets');
const {CannotReadFile} = require('../util/petsException');


describe('petPersistence', () =>{

    let petList = JSON.stringify([
        {
            name: "teste",
            id : 5
        },
        {
            name: "teste 2",
            id : 2
        }
    ]);

    let fileReader;
    let instance;    
    
    describe('#getFileData', () =>{

        beforeEach(()=>{
            fileReader = jest.fn().mockResolvedValue(petList);
            instance = new petsPersistence(fileReader);             
        });

        test('reads the file', ()=>{
            instance.getFileData();
            expect(fileReader).toHaveBeenCalledWith('./db/pets.json', 'utf8');
        });

        test('converts the file content from json', async () => {
            let result = await instance.getFileData();            
            expect(result[0]).toBeInstanceOf(Pet);
            expect(result[1]).toBeInstanceOf(Pet);
        });

        test('Sorts the content by id', async () => {
            let result = await instance.getFileData();
            expect(result[0].id).toEqual(2);
            expect(result[1].id).toEqual(5);
        });

        describe('when an error occurs', () => {

            beforeEach(()=>{
                fileReader = jest.fn().mockRejectedValue(new Error());
                instance = new petsPersistence(fileReader);
            });

            test('Throws a CannotReadFile Error', async () =>{
                try {
                    await instance.getFileData();
                } catch(error) {
                    expect(error).toBeInstanceOf(CannotReadFile);
                }
            });
        })
    })
})