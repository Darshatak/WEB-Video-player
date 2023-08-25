// Get references to DOM elements

const fileInput = document.getElementById("fileInput");
const text = document.getElementById("text");
const video = document.getElementById("videoPlayer");
const selectContainer = document.querySelector(".select");
const videoContainer = document.querySelector(".video-container");
const speedBtn = document.querySelector(".speed-btn")
const playPauseBtn = document.querySelector(".play-pause-btn")
const muteBtn = document.querySelector(".mute-btn")
const volumeSlider = document.querySelector(".volume-slider")
const controls = document.querySelector(".video-container .controls")
const currentTimeElem = document.querySelector(".current-time")
const totalTimeElem = document.querySelector(".total-time")

const select = document.querySelector(".select")


// Listen for changes in the file input
fileInput.addEventListener("change", function () {
    const selectedFile = fileInput.files[0];
    let top = document.querySelector(".top");
    let bottom = document.querySelector(".bottom");
    // Check if a file is selected
    if (selectedFile) {
        // Hide the select container
        text.style = `font-size: 30px;font-weight: 800;`;
        selectContainer.style.display = "block"
        videoContainer.style.visibility = "visible"
        top.style.height ="70%"
        // Display the video container
        // Set the video source to the selected file
        video.src = URL.createObjectURL(selectedFile);
        
        // Play the video
        video.play();
    } else {
        // If no file is selected, reset the video and show the select container
        video.src = "";
        selectContainer.style.display = "block"
        videoContainer.style.display = "none"
        
    }
});

document.addEventListener("keydown", e => {
  const tagName = document.activeElement.tagName.toLowerCase()

  if (tagName === "input") return

  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return
    case "k":
      togglePlay()
      break
    case "f":
      toggleFullScreenMode()
      break
    case "m":
      toggleMute()
      break
    case "arrowleft":
    case "j":
      skip(-5)
      break
    case "arrowright":
    case "l":
      skip(5)
      break
    case "c":
      toggleCaptions()
      break
      case "arrowup":
            if (video.volume < 1.0) {
                video.volume += 0.1;
                if (video.volume > 1.0) {
                    video.volume = 1.0;
                }
            }
            break;
        case "arrowdown":
            if (video.volume > 0.0) {
                video.volume -= 0.1;
                if (video.volume < 0.0) {
                    video.volume = 0.0;
                }
            }
            break;
}
})





// Play/Pause
playPauseBtn.addEventListener("click", togglePlay)
video.addEventListener("click", togglePlay)

function togglePlay() {
    video.paused ? video.play() : video.pause()
}

video.addEventListener("play", () => {
  document.title="Video is playing"
    videoContainer.classList.remove("paused")
})

video.addEventListener("pause", () => {
  document.title="Video Player"
    videoContainer.classList.add("paused")
})


//Change Playback Speed

speedBtn.addEventListener("click", changePlaybackSpeed)

function changePlaybackSpeed() {
    let newPlaybackRate = video.playbackRate + 0.25
    if (newPlaybackRate > 2) newPlaybackRate += 1
    if (newPlaybackRate > 5) newPlaybackRate = 0.25
    video.playbackRate = newPlaybackRate
    speedBtn.textContent = `${newPlaybackRate}x`
}


function skip(duration) {
    video.currentTime += duration
}




// Volume
muteBtn.addEventListener("click", toggleMute)
volumeSlider.addEventListener("input", e => {
  video.volume = e.target.value
  video.muted = e.target.value === 0
})

function toggleMute() {
  video.muted = !video.muted
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume
  let volumeLevel
  if (video.muted || video.volume === 0) {
    volumeSlider.value = 0
    volumeLevel = "muted"
  } else if (video.volume >= 0.5) {
    volumeLevel = "high"
  } else {
    volumeLevel = "low"
  }

  videoContainer.dataset.volumeLevel = volumeLevel
})



function toggleFullScreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen()
      videoContainer.classList.add("close")
      controls.style.color = "white"
    controls.style.background = "transparent"
  } else {
      document.exitFullscreen()
    videoContainer.classList.add("open"); 
    controls.style.color = "black";
    controls.style.background = "white";
  }
}


// videoContainer.addEventListener("mouseout", () => { 
//     controls.style.visibility = "hidden"
// })
// videoContainer.addEventListener("mouseover", () => { 
//     controls.style.visibility = "visible"
// })

videoContainer.addEventListener("mousemove", showControls);
videoContainer.addEventListener("mouseleave", hideControls);










video.addEventListener("loadeddata", () => {
  totalTimeElem.textContent = formatDuration(video.duration)
})

video.addEventListener("timeupdate", () => {
  currentTimeElem.textContent = formatDuration(video.currentTime)
  const percent = video.currentTime / video.duration
  timelineContainer.style.setProperty("--progress-position", percent)
})

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
})
function formatDuration(time) {
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60) % 60
  const hours = Math.floor(time / 3600)
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`
  }
}




let controlsTimeout;

// Function to show controls
function showControls() {
  controls.style.visibility = "visible"
  clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(hideControls, 3000); // Hide controls after 3 seconds of inactivity
}

// Function to hide controls
function hideControls() {
  controls.style.visibility = "hidden"
}