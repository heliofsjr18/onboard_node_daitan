class PersistenceException extends Error{

    constructor(message){
        super(message);
    }

}

class CannotReadFile extends PersistenceException {
    constructor(message = "Could not read file") {
        super(message);
    }
}

class NotFoundException extends PersistenceException {
    constructor(message = 'Data not found'){
        super(message);
    }
    
}

module.exports.PersistenceException = PersistenceException;
module.exports.CannotReadFile = CannotReadFile;
module.exports.NotFoundException = NotFoundException;