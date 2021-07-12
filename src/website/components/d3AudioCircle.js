import React, {useState} from "react";
import styles from "./scetchStyle.css";
import * as d3 from 'd3';

export default function AudioCircle(props) {

    let audioContext = null;
    let audioSource = null;
    let analyser = null;
    let svgContainer = null
    const containerHeight = 600;
    const containerWidth = 1400;
    let svg = null;
    let framesPerSecond = 20;
    let mediaRecorder = null;
    let chunks = [];

    React.useEffect(() => {
        svgContainer = document.getElementById("audioVis3");
        if (!svgContainer) {
            console.log("Error while trying to load svgContainer...");
        }
        drawD3SVG();
        startRecord();
    })

    const initialState = {
        animation: true
    };

    const [state, setState] = useState(initialState);

    function startRecord(){
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.mediaDevices.getUserMedia({
            video : false,
            audio : true
        })
            .then( function audioCallback(stream) {
                audioContext = new AudioContext();
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.start();
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
                analyser.fftSize = 4096;
                audioSource.connect(analyser);

                audioSource.connect(audioContext.destination);
                let data = new Uint8Array(analyser.frequencyBinCount);
                draw(data);
            })
    }

    function stopRecording(){
        setState({
            animation : true
        })
        mediaRecorder.stop();
        audioSource.disconnect()
    }

    function drawD3SVG(){
        const audioVisContainer = document.getElementById("audioVis3");
        audioVisContainer.innerHTML = '';

        svg = d3.select("#audioVis3")
            .style("background", "transparent")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight);
    }

    function draw(frequencyData){
        function renderChart() {

            setTimeout(function() {
                requestAnimationFrame(renderChart);
            }, 1000 / framesPerSecond);

            const test = frequencyData.slice(300, 1000);
            analyser.getByteFrequencyData(test);

            var radiusScale = d3.scaleLinear()
                .domain([0, d3.max(test)])
                .range([0, containerHeight / 2 - 10]);

            var circles = svg.selectAll('circle')
                .data(test);

            circles.enter().append('circle');
            circles.attr("r", function (d) {
                return radiusScale(d);
            })
                .attr("cx", containerWidth / 2)
                .attr("cy", containerHeight / 2)
                .attr("fill", "none")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 1)
                .attr("stroke", "#E1C340")
            circles.exit().remove();
        }
        renderChart();
    }

    function startRecognition() {
        setState({
            animation : false
        })

        fetch('http://localhost:8090/', {method: 'GET'})
            .then(function(response) {
                if(response.ok) {
                    console.log('Send request for audio data...');
                    return;
                }
                throw new Error('Request failed.');
            })
            .catch(function(error) {
                console.log(error);
            });
    }

    return(
        <div>
            <div id="audioVis3" className={state.animation === true ? "d3Vis" : "d3Animation"}/>
            <div>
                <button title="startRecord" className={"button"} onClick={startRecognition}>Start music recognition</button>
                <button title="startRecord" className={"button"} onClick={stopRecording}>Stop music recognition</button>
            </div>
        </div>
    );
}