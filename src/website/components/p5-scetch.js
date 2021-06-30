import React, {useState} from "react";
import styles from "./scetchStyle.css";
import * as d3 from 'd3';

export default function Musictool(props) {

    let audioContext = null;
    let audioSource = null;
    let analyser = null;
    let svgContainer = null
    const containerHeight = 600;
    const containerWidth = 1400;
    let svg = null;

    let canvasContext = null;
    let mediaRecorder = null;
    let chunks = [];


    React.useEffect(() => {
        svgContainer = document.getElementById("audioVis");
        if (!svgContainer) {
            console.log("Error while trying to load svgContainer...");
        }
    })

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
                    console.log(e.data)
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
                drawD3SVG();
                draw(data);
            })
    }

    function stopRecording(){
        mediaRecorder.stop();
        canvasContext.clearRect(0,0,svgContainer.width,svgContainer.height);
        audioSource.disconnect()
    }

    function drawD3SVG(){
        svg = d3.select("#audioVis")
            .style("background", "transparent")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight);
    }

    function draw(frequencyData){
        function renderChart() {
            requestAnimationFrame(renderChart);

            analyser.getByteFrequencyData(frequencyData);

            var radiusScale = d3.scaleLinear()
                .domain([0, d3.max(frequencyData)])
                .range([0, containerHeight/2 -10]);

            var hueScale = d3.scaleLinear()
                .domain([0, d3.max(frequencyData)])
                .range([0, 360]);


            var circles = svg.selectAll('circle')
                .data(frequencyData);

            circles.enter().append('circle');
            circles.attr("r",function(d) { return radiusScale(d); })
                .attr("cx",containerWidth / 2)
                .attr("cy",containerHeight / 2)
                .attr("fill","none")
                .attr("stroke-width",4)
                .attr("stroke-opacity",0.4)
                .attr("stroke", function(d) { return d3.hsl(hueScale(d), 1, 0.5); })
            circles.exit().remove();
        }

        // run the loop
        renderChart();
    }

    function startRecognition() {
        startRecord();

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
            <button title="startRecord" className={"button"} onClick={startRecognition}>Start music recognition</button>
            <button title="startRecord" className={"button"} onClick={stopRecording}>Stop music recognition</button>
        </div>
    );
}