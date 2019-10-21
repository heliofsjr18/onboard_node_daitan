
class Pet{

    constructor(){
        this.name = null,
        this.id = null
    }

    getName(){ return this.name}
    getId() {return this.id}
    setName(name) { this.name = name}
    setId(id) {this.id = id}
}

module.exports = Pet;