const petsPersistence = require('./petsPersistence');
const Pet = require('../model/Pets');
const {CannotReadFile, NotFoundException} = require('../util/petsException');


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

    let petMock = new Pet('teste', 999);

    let fileReader;
    let writeFile;
    let instance;    
    
    describe('#getFileData', () =>{

        beforeEach(()=>{
            fileReader = jest.fn().mockResolvedValue(petList);
            instance = new petsPersistence(fileReader, writeFile);             
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
                instance = new petsPersistence(fileReader, writeFile);
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

    describe('#getAllPets', ()=>{

        beforeEach(()=>{
            fileReader = jest.fn().mockResolvedValue(petList);
            instance = new petsPersistence(fileReader, writeFile);
        });

        test('Check the result list', async() =>{
            let petList = await instance.getAllPets();
            expect(petList[0]).toBeInstanceOf(Pet);
            expect(petList[1]).toBeInstanceOf(Pet);
        })

        describe('When an error occurs', () =>{

            beforeEach(()=>{
                fileReader = jest.fn().mockRejectedValue(new Error());
                instance = new petsPersistence(fileReader, writeFile);
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

    describe('#getPetById', ()=>{

        beforeEach(()=>{
            fileReader = jest.fn().mockResolvedValue(petList);
            instance = new petsPersistence(fileReader, writeFile);
        });

        test('valid object on return of the function', async() =>{
            let petObject = await instance.getPetById(2);
            expect(petObject).toBeInstanceOf(Pet);
        });    
        
        
        describe('When Could not read a file', () =>{

            beforeEach(()=>{
                fileReader = jest.fn().mockRejectedValue(new Error());
                instance = new petsPersistence(fileReader, writeFile);
            });

            test('Throws a CannotReadFile Error', async () =>{
                try {
                    await instance.getPetById();
                } catch(error) {
                    expect(error).toBeInstanceOf(CannotReadFile);
                }
            });

        });

        describe('When data not found', () =>{            
            
            test('throws a NotFoundException error', async() =>{         
                try {
                    await instance.getPetById(999);
                } catch (error) {
                    expect(error).toBeInstanceOf(NotFoundException);
                }       
            });
        }); 
    })


    describe('#insertPet', ()=>{
        beforeEach(()=>{
            fileReader = jest.fn().mockResolvedValue(petList);
            writeFile = jest.fn().mockResolvedValue(petMock);
            instance = new petsPersistence(fileReader, writeFile);
        })

        test('Check if the pet is inserted', async ()=>{
            let pet = new Pet();
            let result = await instance.insertPet(pet);
            expect(result).toBeInstanceOf(Pet);
        })
        

        describe('When and error occurs', ()=>{

            beforeEach(()=>{
                fileReader = jest.fn().mockResolvedValue(petList);
                writeFile = jest.fn().mockRejectedValue(new Error());
                instance = new petsPersistence(fileReader, writeFile);
            })

            test('could not read file', async() =>{
                try {
                    let pet = new Pet();
                    await instance.insertPet(pet);
                } catch (error) {
                    expect(error).toBeInstanceOf(CannotReadFile);
                }
            })
        })
    })

    describe('#updatePet', ()=>{

        beforeEach(()=>{
            fileReader = jest.fn().mockResolvedValue(petList);
            writeFile = jest.fn().mockResolvedValue(petMock);
            instance = new petsPersistence(fileReader, writeFile);
        })

        test('pet object on the return of the function', async ()=>{
            let petUpdate = new Pet();
            petUpdate.id = 2;
            petUpdate.name = 'teste teste';
            let petReturn = await instance.updatePet(petUpdate);
            expect(petReturn).toBeInstanceOf(Pet);
        })


        describe('When Could not read a file', () =>{

            beforeEach(()=>{
                fileReader = jest.fn().mockRejectedValue(new Error());
                writeFile = jest.fn().mockResolvedValue(petMock);
                instance = new petsPersistence(fileReader, writeFile);
            });

            test('Throws a CannotReadFile Error', async () =>{
                try {
                    let petUpdate = new Pet();
                    await instance.updatePet(petUpdate);
                } catch(error) {
                    expect(error).toBeInstanceOf(CannotReadFile);
                }
            });

        });

        describe('When data not found', ()=>{

            beforeEach(() => {
                fileReader = jest.fn().mockResolvedValue(petList);
                writeFile = jest.fn().mockRejectedValue(new Error());
                instance = new petsPersistence(fileReader, writeFile);
            })

            test('throws a NotFoundException error', async ()=>{
                try {
                    let petUpdate = new Pet();
                    await instance.updatePet(petUpdate);
                } catch (error) {
                    expect(error).toBeInstanceOf(NotFoundException);
                }
            })
        })
    })

    describe('#deletePet', ()=> {

        beforeEach(()=>{
            fileReader = jest.fn().mockResolvedValue(petList);
            writeFile = jest.fn().mockResolvedValue(petMock);
            instance = new petsPersistence(fileReader, writeFile);
        })

        test('pet Object on the return of the function', async()=>{            
            let petDeleted = await instance.deletePet(2);
            expect(petDeleted).toBeInstanceOf(Pet);
        });

        describe('When Could not read a file', () =>{

            beforeEach(()=>{
                fileReader = jest.fn().mockRejectedValue(new Error());
                writeFile = jest.fn().mockResolvedValue(petMock);
                instance = new petsPersistence(fileReader, writeFile);
            });

            test('Throws a CannotReadFile Error', async () =>{
                try {
                    await instance.deletePet(2);
                } catch(error) {
                    expect(error).toBeInstanceOf(CannotReadFile);
                }
            });

        });

        describe('When data not found', ()=>{
            beforeEach(()=>{
                fileReader = jest.fn().mockResolvedValue(petList);
                writeFile = jest.fn().mockRejectedValue(new Error());
                instance = new petsPersistence(fileReader, writeFile);
            })

            test('Throws a CannotReadFile Error', async()=>{
                try {
                    await instance.deletePet(999);
                } catch (error) {
                    expect(error).toBeInstanceOf(NotFoundException);
                }
            })
        })
    })
})