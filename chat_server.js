import WebSocket, { WebSocketServer } from "ws";

console.log("Starting WebSocket Server on port 3000.");
const wss = new WebSocketServer({ 
  port: 3000,
  maxPayload: 1024 * 1024
});

var message = '{"type":"message","data":"Welcome to the Server!"}'.toString('utf-8');

var message_json = {
  "type": "message",
  "from_userid": 0,
  "from_username": "",
  "data": "",
}


const userList = [
  { key: -1, value: "Server"}
];

function getUserNameByID(id) {
  const foundItem = userList.find(item => item.key === id);
  return foundItem ? foundItem.value : undefined; // Return the value or undefined if key not found
}
function changeUsernameByID(keyToChange, newValue) {
  const itemToUpdate = userList.find(item => item.key === keyToChange);
  if (itemToUpdate) {
    itemToUpdate.value = newValue;
  } else {
    console.log(`Key '${keyToChange}' not found in the list.`);
  }
}
function generateRandomString(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; // Characters to choose from
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}


let ids = 0;
wss.on("connection", function connection(ws) {

  ws.id = ids++;
  var newUserName = generateRandomString(6);
  userList.push({key: ws.id, value: newUserName});
  console.log("New User with ID: " + ws.id + " has joined and is temporarely called: " + newUserName  + ".");

  message_json.data = "Welcome to the Server!";
  message_json.from_userid = -1;
  message_json.from_username = "Server";
  console.log("Sending welcome message: " + JSON.stringify(message_json));
  ws.send(JSON.stringify(message_json));
  

  ws.on('error', console.error);
  ws.on("message", msg => {
    const bufferMessage = msg.toString('utf-8');
    var json = JSON.parse(bufferMessage);
    json.from_userid = ws.id;
    json.from_username = getUserNameByID(ws.id);
    console.log(json);

    if(json.data.includes("/username")){
      var new_username = json.data.split("/username")[1].trim();
      changeUsernameByID(ws.id, new_username);
      console.log("UserID " + ws.id + "changed their username to " + new_username);
    }else{
      // nur wenn kein command benutzt wurde dann rumschicken
      wss.clients.forEach(client => {
          //client.send(`${ws.id}: ${msg}`);
          //client.send(json.toString('utf-8'));
          client.send(JSON.stringify(json));
      });
    }
  });
});