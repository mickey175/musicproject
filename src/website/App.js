import './App.css';
import {useEffect, useState, setState} from "react";
import io from 'socket.io-client';
import SongPanel from "./components/songPanel";
import AudioVisualSwitcher from "./components/audioVisSwitcher";

const ioClient = io.connect('http://localhost:8090');

function App() {

    useEffect(() => {
        ioClient.on('incoming', (songData) => {
                setState({
                    title: songData !== null ? songData.title : "Nothing found...",
                    subtitle: songData !== null ? songData.subtitle : "Nothing found...",
                    url: songData !== null ? songData.url : "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/783px-Test-Logo.svg.png",
                    isData: true,
                    activeTool: state.activeTool
            })
        });
        ioClient.on('error', (songData) => {
            if(songData !== null) {
                setState({
                    title: '',
                    subtitle: '',
                    isData: false,
                    url: '',
                    activeTool: state.activeTool
                })
            }
        });
    });

    const initialState = {
        title: '',
        subtitle: '',
        isData: false,
        url: '',
        activeTool: 1
    };

    function inCreaseTool(){
        setState({
            title: '',
            subtitle: '',
            isData: false,
            url: '',
            activeTool: state.activeTool +1
        })
    }

    const [state, setState] = useState(initialState);

    return (
    <div className="App">
        <p id="p2" className={"headline"}>Music recognition and visualization</p>
        <button className="button" onClick={inCreaseTool}>Next Visualisation</button>
        <SongPanel title={state.title} subtitle={state.subtitle} isData={state.isData} url={state.url}/>
        <AudioVisualSwitcher activeTool={state.activeTool} isData={state.isData}/>
    </div>
  );
}

export default App;
