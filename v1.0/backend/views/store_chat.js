export function storeChatMessage(group, messages) {



    const dbName = "chat_messages";

    var request = indexedDB.open(dbName, 1);

    request.onerror = e => {

        console.log('there was an error');

    };

    request.onupgradeneeded = event => {


        let db = event.target.result;

        let objectStore = db.createObjectStore(group, { keyPath: 'username' });

        objectStore.createIndex("messages", "messages", { unique: true });

        objectStore.transaction.oncomplete = event => {

            var chats = db.transaction(group, "readwrite").objectStore(group);

            chats.add({
                username: messages.user,
                messages
            });

            console.log('added data to the database successfully');

        };


    };


    request.onsuccess = event => {

        let db = event.target.result;

        if (db) {
            console.log('database successfully opened');
        }

        db.transaction(group, "readwrite").objectStore(group).add({

            username: messages.user,
            messages

        });


        console.log('appended new data');



    };





}