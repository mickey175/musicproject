import './App.css';
import AudioCircle from "./components/d3AudioCircle.js";
import {useEffect, useState, setState} from "react";
import io from 'socket.io-client';
import SongPanel from "./components/songPanel";
import AudioDots from "./components/d3AudioDots.js";
import AudioBar from "./components/d3AudioBar";

const ioClient = io.connect('http://localhost:8090');

function App() {

    useEffect(() => {
        ioClient.on('incoming', (songData) => {
            if(songData !== null) {
                setState({
                    title: songData.title,
                    subtitle: songData.subtitle,
                    isData: true
                })
            }
        });
        ioClient.on('error', (songData) => {
            if(songData !== null) {
                setState({
                    title: '',
                    subtitle: '',
                    isData: false
                })
            }
        });
    });

    const initialState = {
        title: '',
        subtitle: '',
        isData: false,
        activeTool: 1
    };

    function inCreaseTool(){
        setState({
            title: '',
            subtitle: '',
            isData: false,
            activeTool: state.activeTool +1
        })
    }

    const [state, setState] = useState(initialState);

    return (
    <div className="App">
        <p id="p2" className={"headline"}>Music recognition and visualization</p>
        {/*<button className="button" onClick={inCreaseTool}>Next Visualisation</button>*/}
        <SongPanel title={state.title} subtitle={state.subtitle} className={state.isData ? 'songInfoVis' : 'songInfoHid'}/>
        <AudioBar isData={state.isData} isActiveTool={state.activeTool}/>
        {/*<AudioDots isData={state.isData} isActiveTool={state.activeTool}/>*/}
        {/*<AudioCircle isData={state.isData} isActiveTool={state.activeTool}/>*/}
    </div>
  );
}

export default App;
