function saveUserInput(group, members, messages) {




    const DatabaseUtility = require('./database/index.js');

    const storeNewChatData = require('./newChat/index.js');

    const updateChatData = require('./updateChat/index.js');

    var instance = new DatabaseUtility('chatApplication');

    var conn = instance.establishDbConnection();

    var mongoose = instance.getMongooseInstance();


    instance.checkConnectionErrors(conn);


    instance.databaseOperations(conn, async () => {


        var chatMessages;

        try {
            chatMessages = mongoose.model('chatMessages');
        } catch (modelErrors) {

            let collection = new mongoose.Schema({

                group: String,
                chats: Object


            });


            chatMessages = mongoose.model('chatMessages', collection);
            
        }


        var isPreviousChatDataExist = await chatMessages.find({ group }, (err, data) => {

            if (err) return;

            return data;

        });

        if (isPreviousChatDataExist.length > 0) {


            await updateChatData(group, messages, chatMessages);  // group,messages,clientMsgId



        } else {



            var stored = await storeNewChatData(group, members, messages, chatMessages); // group,members,messages

            if (stored) {

                console.log('stored successfully new chat');

            }

        }




    });


}



module.exports = saveUserInput;