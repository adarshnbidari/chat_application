async function update_msg_status(roomName, messages) {

    const DatabaseUtility = require('../database/index.js');


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



        var get_stored_data = await chatMessages.findOne({ group: roomName });

        get_stored_data = get_stored_data.toObject();


        if (Object.keys(get_stored_data).length > 0) {


            for (let message_ids in get_stored_data.chats.messages) {

                if (get_stored_data.chats.messages[message_ids].msg_seen_id == messages.msg_seen_id) {


                    var is_delivered_to_all = await chatMessages.findOne({

                        group: roomName,

                        [`chats.messages.${message_ids}.msg_seen_id`]: messages.msg_seen_id

                    });


                    is_delivered_to_all = is_delivered_to_all.toObject();


                    if (is_delivered_to_all.chats.messages[message_ids].delivered_to_users + 1 >= is_delivered_to_all.chats.members.length) {

                        console.log('message sent to all :)');

                        chatMessages.deleteOne({

                            group: roomName,

                            [`chats.messages.${message_ids}.msg_seen_id`]: messages.msg_seen_id


                        }, (err, d) => {
                            console.log(d);
                            console.log('------');
                            console.log('message deleted');
                        });


                    } else {

                        await chatMessages.updateOne({

                            group: roomName,

                            [`chats.messages.${message_ids}.msg_seen_id`]: messages.msg_seen_id


                        }, {


                            $inc: {

                                [`chats.messages.${message_ids}.delivered_to_users`]: 1

                            }


                        });


                    }






                }


            }



        }







    });


}



module.exports = update_msg_status;