// JAVASCRIPT FOR VIDEOCALL PAGE 

//give reference to socket and pass the path that we are going to call
const socket = io('/')
const videoGrid = document.getElementById('video-grid')

// create a new peer connecting to our own server
const myPeer = new Peer(undefined, { host: "peerjs-server.herokuapp.com", secure: true, port: 443, });

let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}


/**
 * CONNECT TO AUDIO AND VIDEO OF USERS
 */
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true,
  audio: {
    echoCancellation: true,
    noiseSuppression: true
  }
}).then(stream => {
  myVideoStream = stream;
  addVideoStream(myVideo, stream)
  myPeer.on('call', call => {
    // once the user is connected append his/her video to display
    call.answer(stream)
    const video = document.createElement('video')
    call.on('stream', userVideoStream => {
      addVideoStream(video, userVideoStream)
    })
  })
  //new user's video is appended if he/she enters the meeting
  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      text.val('')
    }
  });
  socket.on("createMessage", message => {
    //appending message sent by user to the list of messages
    $("ul").append(`<li class="message"><b>User</b><br/>${message}</li>`);
    scrollToBottom()
  })
})


/**
 * 
 * if user leaves the meeting closes the data connection gracefully, 
 * cleaning up underlying DataChannels and PeerConnections.
 */
socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
})

/**
 * Emitted when a connection to the PeerServer is established. 
 * id is the brokering ID of the peer 
 * 
 */
myPeer.on('open', id => {
  socket.emit('join-room', ROOM_ID, id)
})


/**
 * 
 * @param {string} userId 
 * @param {*} stream 
 */
function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')
  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}


/**
 * 
 * @param {*} video NEW USER'S VIDEO WHICH WE ARE GOING TO APPEND TO VIDEOGRID
 * @param {*} stream SOURCE OF THE MEDIA WE ARE TRYING TO FETCH (AUDIO AND VIDEO)
 */
function addVideoStream(video, stream) {

  video.srcObject = stream  // allows us to play our video

  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}
const scrollToBottom = () => {
  var d = $('.main__chat_window');
  d.scrollTop(d.prop("scrollHeight"));
}


/**
 *  FUNCTION TO GIVE USER AN OPTION TO MUTE/UNMUTE HIMSELF/HERSELF
 */
const muteUnmute = () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    setUnmuteButton();
  } else {
    setMuteButton();
    myVideoStream.getAudioTracks()[0].enabled = true;
  }
}

/**
 * FUNCTION TO GIVE USER OPTION TO TURN HIS CAMERA ON / OFF
 */
const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setPlayVideo()
    } else {
      setStopVideo()
      myVideoStream.getVideoTracks()[0].enabled = true;
    }
  }

/**
 * SETTING MUTE BUTTON, ITS STYLES AND INNER TEXT TO DISPLAY
 */
const setMuteButton = () => {
  const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  ` 
  document.querySelector('.main__mute_button').innerHTML = html;
}


/**
 * SETTING UNMUTE BUTTON, ITS STYLE AND INNER TEXT TO DISPLAY
 */
const setUnmuteButton = () => {
  const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
  document.querySelector('.main__mute_button').innerHTML = html;
}

/**
 * SETTING TURN OFF VIDEO BUTTON, ITS STYLE AND TEXT TO DISPLAY
 */
const setStopVideo = () => {
  const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}


/**
 * SETTING TURN ON VIDEO BUTTON, ITS STYLE AND TEXT TO DISPLAY
 */
const setPlayVideo = () => {
  const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
  document.querySelector('.main__video_button').innerHTML = html;
}


/**
 * 
 * @returns A Promise whose fulfillment handler receives a MediaStream object when the requested media
 *  has successfully been obtained.
 */
function  shareScreen() {
       return navigator.mediaDevices.getDisplayMedia( {
         video: {
            cursor: "always"
        },
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
        }
    } ).then((stream)=>{
    let getVideoTrack=stream.getVideoTracks()[0];
    console.log(getVideoTrack)
    let sender =myPeer.getSenders().find(function(s){
       return s.track.kind==videoTrack.kind
    })
    sender.replaceTrack(myVideo)
    }).catch((err)=>{
       console.log("unable to get displaymedia" +err)
    })
}
