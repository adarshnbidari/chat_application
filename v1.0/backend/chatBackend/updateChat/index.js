async function updateChatData(group, messages, model) {


    var getPreviousChats = await model.find({ group });

    if (getPreviousChats.length > 0) {

        getPreviousChats = getPreviousChats[0];

        if (!getPreviousChats.chats.members.includes(messages.sentFrom)) {
            return false;
        }

        var new_id = Object.keys(getPreviousChats.chats.messages).length + 1;

        var newMessage = {

            [new_id]: {

                msgData: messages.msgData,
                sentFrom: messages.sentFrom,
                msg_seen_id: messages.msg_seen_id,
                time: messages.time,
                role: 'user',
                type: 'text/plain',
                delivered_to_users: 0,
                delivered_to_all: false

            },

            new_current_private_msg_id: new_id


        };

        var updateChatMessages = await model.updateOne({ group }, {

            $set: {
                [`chats.messages.${new_id}`]: newMessage[new_id],
                current_private_msg_id: newMessage.new_current_private_msg_id

            }

        }, (e, r) => {
            if (e) {
                console.log(e);
            } else {
                console.log(r);
            }

        });


    } else {
        return false;
    }



}


module.exports = updateChatData;