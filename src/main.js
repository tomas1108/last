const mic_btn = document.getElementById("mic"); // Removed #
const playback = document.querySelector(".playback"); // Changed getElementById to querySelector

// mic_btn.addEventListener("click", ToggleMic);

let can_record = false;
let is_recording = false;

let recorder = null;

let chunks = [];

function SetupAudio() {
    console.log("Setting up audio");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({
                audio: true
            })
            .then(SetupStream)
            .catch(err => console.error(err));

    }
}
SetupAudio();

function SetupStream(stream) {

    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
        chunks.push(e.data);
    };
    recorder.onstop = e => { 
        const blob = new Blob(chunks, {type: "audio/ogg; codecs=opus"});
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        playback.src = audioURL;
    }

    can_record = true;

}

function ToggleMic() {
    if (!can_record) return;

    is_recording = !is_recording;

    if (is_recording) {
        recorder.start();
        mic_btn.classList.add("recording");
    } else {
        recorder.stop();
        mic_btn.classList.remove("recording");
    }
}

mic_btn.addEventListener("click", ToggleMic); // Added event listener
