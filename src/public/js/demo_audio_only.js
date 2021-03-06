//
//Copyright (c) 2016, Skedans Systems, Inc.
//All rights reserved.
//
//Redistribution and use in source and binary forms, with or without
//modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
//LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
//POSSIBILITY OF SUCH DAMAGE.
//
var selfEasyrtcid = "";
easyrtc.setUsername(document.location.hash || "user-"+Date.now());
function disable(domId,to_admin) {
    document.getElementById("micWork").style.display = "none";
    console.log("disable. domId", domId)
    document.getElementById(domId).disabled = "disabled";
}


function enable(domId,to_admin) {
    console.log("enable. domId", domId);
    document.getElementById(domId).disabled = "";
}


function connect() {
    console.log("connect", Date.now());
    console.log("Initializing.");
    hangup();
    easyrtc.enableVideo(false);
    easyrtc.enableVideoReceive(false);
    easyrtc.setRoomOccupantListener(convertListToButtons);




    easyrtc.joinRoom("Lobby", {}, console.log, console.error)
    easyrtc.initMediaSource(
        function () {        // success callback
            console.log("easyrtc.initMediaSource success");
            easyrtc.connect("easyrtc.audioOnly", loginSuccess, loginFailure);
        },
        function (errorCode, errmesg) {
            console.log("easyrtc.initMediaSource error", errorCode, errmesg);
            easyrtc.showError(errorCode, errmesg);
        }  // failure callback
        , "Lobby");
    muteIfAdmin();
}


function terminatePage() {
    console.log("terminatePage");
    easyrtc.disconnect();
}


function hangup() {
    console.log("hangup");
    easyrtc.hangupAll();
    disable('hangupButton');
    document.getElementById("micWork").style.display = "none";
}


function clearConnectList() {
    console.log("clearConnectLis");
    otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }

}
function muteIfAdmin (){
    if (easyrtc.idToName(selfEasyrtcid) === "#admin") {
        console.log("muting admin")
        easyrtc.enableMicrophone(true)
    }
}
var adminRtcid ='';
var callAmin = function(){
    performCall(adminRtcid,true);
}
function convertListToButtons(roomName, occupants, isPrimary) {
    muteIfAdmin ();
    document.getElementById("sratInfo").innerHTML = "You are offline...";
    console.log("convertListToButtons", roomName, occupants, isPrimary);
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    console.log("occupants", occupants)
    for (var easyrtcid in occupants) {
        var button = document.createElement('button');
        var div = document.createElement('div');
        button.onmousedown = function (easyrtcid) {
            return function () {
                performCall(easyrtcid);
            };
        }(easyrtcid);

        var label = document.createElement('text');
        if (easyrtc.idToName(easyrtcid) !== "#admin") {
            label.innerHTML = easyrtc.idToName(easyrtcid);

            div.appendChild(label);
            otherClientDiv.appendChild(div);

        }else{
            adminRtcid = easyrtcid;
            document.getElementById("sratInfo").innerHTML = "Start Speaking...";
            // // label.innerHTML = easyrtc.idToName(easyrtcid);
            // label.innerHTML = "Start Speaking..."
            // button.appendChild(label);
            // otherClientDiv.appendChild(button);
        }

    }
}


function performCall(otherEasyrtcid,to_admin) {
    console.log("performCall", otherEasyrtcid);
    document.getElementById("micWork").style.display = "block";
    // easyrtc.hangupAll();
    var acceptedCB = function (accepted, caller) {
        console.log("acceptedCB", accepted, caller);

        if (!accepted) {
            easyrtc.showError("CALL-REJECTED", "Sorry, your call to " + easyrtc.idToName(caller) + " was rejected");
            enable('otherClients');
        }
    };
    var successCB = function () {

        enable('hangupButton',to_admin);
    };
    var failureCB = function () {
        enable('otherClients');
    };
    easyrtc.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
}


function loginSuccess(easyrtcid) {
    muteIfAdmin()
    console.log("loginSuccess", easyrtcid)
    disable("connectButton",true);
    // enable("disconnectButton");
    enable('otherClients');
    selfEasyrtcid = easyrtcid;
    document.getElementById("iam").innerHTML = "Connected as " + easyrtc.idToName(easyrtcid);

}


function loginFailure(errorCode, message) {
    console.log("loginFailure", loginFailure)
    easyrtc.showError(errorCode, message);
}


function disconnect() {
    console.log("disconnect");
    document.getElementById("iam").innerHTML = "logged out";
    easyrtc.disconnect();
    console.log("disconnecting from server");
    enable("connectButton");
    // disable("disconnectButton");
    clearConnectList();
}


easyrtc.setStreamAcceptor(function (easyrtcid, stream) {
    console.log("setStreamAcceptor", easyrtcid, stream)
    var audio = document.getElementById('callerAudio');
    easyrtc.setVideoObjectSrc(audio, stream);
    enable("hangupButton");
});


easyrtc.setOnStreamClosed(function (easyrtcid) {
    console.log("setOnStreamClosed", easyrtcid)
    easyrtc.setVideoObjectSrc(document.getElementById('callerAudio'), "");
    disable("hangupButton");
});


easyrtc.setAcceptChecker(function (easyrtcid, callback) {
    console.log("call accepted from ", easyrtcid);
    muteIfAdmin();
    hangup();
    callback(true);
});