const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

class DbConnector{
    
    constructor(){
        mongoose.connect("mongodb://localhost/pets", {useUnifiedTopology : true, useNewUrlParser:true})
         .then(res=>console.log("CONECTOOOUUU:   ", res))
         .catch(err=>console.log("FAAAALHOOOOOUUU: ", err ));
    }

    createSchema(){
        return mongoose.Schema = ({
            name : mongoose.SchemaTypes.String,
            id : mongoose.SchemaTypes.Number
        });
    }    
}

module.exports.DbConnector = DbConnector