const ws = new WebSocket("ws://localhost:3000");
var username = "local";

// Event Listener for send button
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('button-send');

messageInput.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendButton.click();
  }
});
//--------------------------------

ws.addEventListener("message", function(event) {
    var msg = JSON.parse(event.data);
    console.log(msg);
    if (event.type === "message") {
        addMessage(msg);
    }
});

function sendMessage() {
    const message = document.getElementById("message-input").value;

    if (!message) return false;

    if(message.includes("/username")){
        var new_username = message.split("/username")[1].trim();
        username = new_username;
        console.log("New username: " + username);
    }

    ws.send(JSON.stringify({ type: "message",  data: message }));

    //addMessage(message);
    document.getElementById("message-input").value = "";
}

function getTime()  {
    const currentDate = new Date();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const formattedTime = `${hours}:${minutes}:${seconds}`;
    return formattedTime;
}

function addMessage(message) {
console.log(message);
var message_text = message.data;
var from_userid = message.from_userid;
var from_username = message.from_username;
    /*
    const node = document.createElement("P");
    const text = document.createTextNode(username + " " + message);
    //var timeStamp = getTime();
    node.appendChild(text);
    node.classList.add("chat-messages");
    document.getElementById("chat").appendChild(node);
*/
const chatMessagesDiv = document.createElement("div");
chatMessagesDiv.classList.add("chat-messages");

const div = document.createElement("div");
div.classList.add("chat-message");

const spanName = document.createElement("span");
spanName.classList.add("chat-name", "chat-name-local");
// Grün machen wenn User -1 (also Server) ist
if(from_userid == -1){
    spanName.style.color = "green";
}else{
    spanName.style.color = "white";
}
spanName.innerHTML = "&lt;"+ from_username +"&gt; ";

const spanMsg = document.createElement("span");
spanMsg.classList.add("chat-msg", "chat-msg-local");
spanMsg.textContent = message_text;

const spanDate = document.createElement("span");
spanDate.classList.add("chat-date");
spanDate.title = getTime();
spanDate.textContent = getTime();

div.appendChild(spanName);
div.appendChild(spanMsg);
div.appendChild(spanDate);

chatMessagesDiv.appendChild(div);

document.getElementById("chat").appendChild(chatMessagesDiv);

    
}