const mongoose = require('mongoose')
const config = require('config')

const dbJson = config.get("mogoURI")

const ConnectDB = async () =>{
    try {
        
        await mongoose.connect(dbJson, {
            useUnifiedTopology: true, 
            useNewUrlParser: true, 
            useCreateIndex: true,
            useFindAndModify:false
        })
        console.log('DataBase Conneted...');
        

    } catch (e) {
        console.error(e.message)
        // Exit Process With Failure
        process.exit(1)
    }
}

module.exports = ConnectDB;