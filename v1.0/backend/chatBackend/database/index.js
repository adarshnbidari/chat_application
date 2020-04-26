class DatabaseUtility {

    constructor(databaseName) {

        this.mongoose = require('mongoose');

        (async () => {

            await this.mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {

                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false

            });

        })();

    }

    getMongooseInstance(){

        return this.mongoose;

    }

    establishDbConnection() {

        return this.mongoose.connection;


    }

    checkConnectionErrors(connection) {

        connection.on('error', (e) => {

            if (e) return false;

            return true;

        });


    }


    databaseOperations(connection, callback) {

        connection.once('open', () => {

            callback();


        });


    }

    closeConnection(connection) {

        connection.close();
    }


}


module.exports=DatabaseUtility;