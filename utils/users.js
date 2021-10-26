const users = [];

/**
 * 
 * @param {} id particular user's userid
 * @param {string} username username that user had entered
 * @param {string} room room where user wants to land
 * @returns a user after alloting it room name, username and user id
 */
function userJoin(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}


/**
 * 
 * @param {id of user} id here it works as primary key to identify user
 * @returns index where particular id was found
 */
function getCurrentUser(id) {
  return users.find(user => user.id === id);
}


/**
 * 
 * @param {*} id the particular user's id
 * @returns index where userid was found( if it was found )
 * purpose: if user is present in room then remove him/her from users list
 */
function userLeave(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

/**
 * 
 * @param {room name input by user} room the particular room name where user wants to land
 * @returns users of that perticular room 
 */
function getRoomUsers(room) {
  return users.filter(user => user.room === room);
}

/**
 * export the functions required
 */
module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};
