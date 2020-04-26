function storeNewChatData(group, members, messages, model) {

    var message = {

        groupName: group,

        members,

        duo: members.length == 2 ? true : false,

        messages: {

            1: {
                msgData: messages.msgData,
                sentFrom: messages.sentFrom,
                msg_seen_id: messages.msg_seen_id,
                time: messages.time,
                role: 'user',
                type: 'text/plain',
                delivered_to_users: 0,
                delivered_to_all: false
            }


        },

        current_private_msg_id: 1

    }



    var storeNewData = new model({

        group,
        chats: message


    });


    return storeNewData.save();


}


module.exports = storeNewChatData;