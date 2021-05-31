import React from "react";

export default function Musictool(props) {

    let audioContext = null;
    let audioSource = null;
    let analyser = null;
    let canvas = null
    let canvasContext = null;

    React.useEffect(() => {
        canvas = document.getElementById("audioVis");
        if (canvas) {
            console.log("Canvas is loaded: "+canvas);
        }
        canvasContext = canvas.getContext("2d");
    })

    function startRecord(){
        console.log("Start recording...")

        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

        navigator.mediaDevices.getUserMedia({
            video : false,
            audio : true
        })
            .then( function audioCallback(stream) {
                audioContext = new AudioContext();
                audioSource = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                audioSource.connect(analyser);

                audioSource.connect(audioContext.destination);
                let data = new Uint8Array(analyser.frequencyBinCount);
                requestAnimationFrame(loopingFunction);

                function loopingFunction(){
                    requestAnimationFrame(loopingFunction);
                    analyser.getByteFrequencyData(data);
                    draw(data);
                }
            })
    }

    function stopRecording(){
        console.log("Stop recording...")
        canvasContext.clearRect(0,0,canvas.width,canvas.height);
        audioSource.disconnect()
    }

    function draw(data){
        data = [...data];
        canvasContext.clearRect(0,0,canvas.width,canvas.height);
        let space = canvas.width / data.length;
        data.forEach((value,i) => {
            canvasContext.beginPath();
            canvasContext.moveTo(space*i,canvas.height);
            canvasContext.lineTo(space*i,canvas.height-value);
            canvasContext.strokeStyle = "#FF0000";
            canvasContext.stroke();
        })
    }

    return(
        <div>
            <button title="startRecord" onClick={startRecord}>Start</button>
            <button title="startRecord" onClick={stopRecording}>Stop</button>
        </div>
);
};