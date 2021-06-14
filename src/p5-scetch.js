import React from "react";
import styles from "./scetchStyle.css"
import {getMusicInformation} from "./sendRequsest";


export default function Musictool(props) {

    let audioContext = null;
    let audioSource = null;
    let analyser = null;
    let canvas = null
    let canvasContext = null;
    let mediaRecorder = null;
    let chunks = [];

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
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
                console.log(mediaRecorder.state);
                console.log("recorder started");
                chunks = [];
                mediaRecorder.ondataavailable = function(e) {
                    chunks.push(e.data);
                }

                mediaRecorder.onstop = function(e) {
                    const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                    chunks = [];
                }

                audioSource = audioContext.createMediaStreamSource(stream);
                analyser = audioContext.createAnalyser();
                analyser.fftSize = 2048;
                audioSource.connect(analyser);

                audioSource.connect(audioContext.destination);
                let data = new Uint8Array(analyser.frequencyBinCount);
                requestAnimationFrame(loopingFunction);
                getMusicInformation();
                function loopingFunction(){
                    requestAnimationFrame(loopingFunction);
                    analyser.getByteFrequencyData(data);
                    draw(data);
                }
            })


    }

    function stopRecording(){
        console.log("Stop recording...")
        mediaRecorder.stop();
        console.log(mediaRecorder.state);
        console.log("recorder stopped");

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
            canvasContext.strokeStyle = `rgb(
                ${Math.floor(240)},
                ${Math.floor(233)},
                ${Math.floor(180)})`
            ;
            canvasContext.stroke();
        })
    }

    return(
        <div>
            <button title="startRecord" className={"button"} onClick={startRecord}>Start music recognition</button>
            <button title="startRecord" className={"button"} onClick={stopRecording}>Stop music recognition</button>
        </div>
    );
}