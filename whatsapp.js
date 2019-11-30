const sulla = require('sulla-hotfix');
const request = require('request');
const webhook = "https://api-register.tsl-university.id/receive_message/5dddd9bec1bfdf3a09adda7d";

sulla.create().then(client => start(client));

function triggerServer(requestMessage, client) {
  if (requestMessage.message.match(/TSL/))
  
  request.post({url: webhook, body: JSON.stringify(requestMessage), headers: {"Content-Type": "application/json"}}, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the response status code if a response was received

      if (response.statusCode === 200 && snapshot && snapshot.reply) {
        let snapshot = JSON.parse(body);  
        client.sendText(requestMessage.number, snapshot.message);
      }
  });
}

function start(client) {
  client.onMessage(message => {
    const requestMessage = {
        number: message.from,
        message: message.body
    };

    if (typeof requestMessage.message === 'string')
      triggerServer(requestMessage, client);    
  });

  setTimeout(() => {
    client.getUnreadMessages(true, true, true).then(chats => {
      chats.forEach(function (chat, index) {
          if (! chat.isGroup) {
              chat.messages.forEach(function (message, index) {

                  if (typeof message.body === 'string') {
                    const requestMessage = {
                        number: message.from._serialized,
                        message: message.body
                    };

                    if (index === chat.messages.length-1)
                      triggerServer(requestMessage, client);
                  }
              });
          }
      });
    });
  }, 6000);
}
