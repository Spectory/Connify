

function onFinishLoading() {
  setTimeout(() => {
    console.log("Initializing.");
    easyrtc.enableVideo(false);
    easyrtc.enableVideoReceive(false);
    easyrtc.joinRoom("Lobby", {}, console.log, console.error);
    easyrtc.getRoomList(console.log, console.error);
  }, 1000)
}