class PetsException extends Error{

    constructor(message){
        super(message);
    }

}

class CannotReadFile extends PetsException {
    constructor(message = "Could not read file") {
        super(message);
    }
}

class NotFoundException extends PetsException {
    constructor(message = 'Data not found'){
        super(message);
    }
    
}


module.exports.PetsException = PetsException;
module.exports.CannotReadFile = CannotReadFile;
module.exports.NotFoundException = NotFoundException;