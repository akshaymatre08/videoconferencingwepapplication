// JAVASCRIPT FOR CHAT PAGE AND CHAT ENTRANCE PAGE  
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

/**
 * get room and username of user from url
 */
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

/**
 * function to send message to all users of that room that a user with username has joined
 */
socket.emit('joinRoom', { username, room });


/**
 * function to get room name and users 
 */
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});


/**
 * 
 */
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


/**
 * function triggered when a user submits a message
 */
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;

  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


/**
 * 
 * @param {string} message the message which user has sent
 * message.username - the user who sent the message
 * message.time - the time at which user sent the message
 */
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

/**
 * 
 * @param {string} room The name name of room which user has joined 
 */
function outputRoomName(room) {
  roomName.innerText = room;
}

/**
 * ADDS EACH USER'S NAME TO USERS LIST
 * @param {list} users the list from which we get name of users and append is to userlist 
 */
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

/**
 * POPUP TO ASK USER IF HE/SHE IS GOING LEAVE THE MEETING OR CONTINUE
 */
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
  if (leaveRoom) {
    window.location = '../index.html';
  } else {
  }
});
