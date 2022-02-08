const chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//get username and room from url
const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});


const socket = io()

//join chat room

socket.emit('joinRoom', {username, room})
// Message submit from server
socket.on('message', message => {
    console.log(message);
    outputMessage(message);
    //scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;
   
});

// get room and users

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
})

//Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // we get an id "msg" at input field in form at chat.html
    const msg = e.target.elements.msg.value
    //Emit message to server
    socket.emit('chatMessage', msg)
     //Clear input from server
     e.target.elements.msg.value = "";
     e.target.elements.msg.focus();
})

//Output message to DOM
function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `
    <p class="meta">${message.from_user}</p>
    <p class="text">
        ${message.message}
    </p>
    `;

    document.querySelector('.chat-messages').appendChild(div);
}

function outputRoomName(room){
    roomName.innerText = room;

}

function outputUsers(users){
    userList.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}


