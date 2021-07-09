import React, {useState} from "react";
import styles from "./scetchStyle.css";
import * as d3 from 'd3';

export default function AudioBar(props) {

    let audioContext = null;
    let audioSource = null;
    let analyser = null;
    let svgContainer = null
    const containerHeight = 600;
    const containerWidth = 1400;
    let svg = null;
    let mediaRecorder = null;
    let chunks = [];

    React.useEffect(() => {
        console.log(props)
        svgContainer = document.getElementById("audioVis1");
        if (!svgContainer) {
            console.log("Error while trying to load svgContainer...");
        }
        drawD3SVG();
        startRecord();
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
        mediaRecorder.stop();
        audioSource.disconnect()
    }

    function drawD3SVG(){
        svg = d3.select("#audioVis1")
            .style("background", "transparent")
            .append("svg")
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .attr("background-color","green");
    }

    function draw(frequencyData){

        var colorScale = d3.scaleLinear()
            .domain([0, 100])
            .range(["#006400","#99c199"]);

        var circleX = d3.scaleLinear()
            .domain([0, frequencyData.length])
            .range([0, containerWidth*3]);

        var rects = svg.selectAll('rect')
            .data(frequencyData)
            .enter().append('rect')
            .attr("x", function (d, i) {return circleX(i); })
            .attr("width", function (d, i) { return 5; })
            .attr("height", function (d, i) { return containerHeight; });

        function renderChart() {

            requestAnimationFrame(renderChart);
            const test = frequencyData.slice(300, 1000);
            analyser.getByteFrequencyData(test);

            svg.selectAll('rect')
                .data(test)
                .attr('y', function(d) { return containerHeight-5-(d*3); })
                .attr('fill', function(d, i) { return colorScale(d); });
        }
        // run the loop
        renderChart();
    }

    function startRecognition() {
        console.log(props.isActiveTool)
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
            <div id="audioVis1" className={"d3Vis"}/>
            <div>
                <button title="startRecord" className={"button"} onClick={startRecognition}>Start music recognition</button>
                <button title="startRecord" className={"button"} onClick={stopRecording}>Stop music recognition</button>
            </div>
        </div>
    );
}