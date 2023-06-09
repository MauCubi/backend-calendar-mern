const mongoose = require('mongoose');

const dbConnection = async() => {

    try {        

        mongoose.connect(process.env.DB_CNN);
        mongoose.set('strictQuery', true);

        console.log('DB ONLINE');


    } catch (error) {
        console.log(error);
        throw new Error('Error al iniciar la base de datos')
    }
}


module.exports = {
    dbConnection
}