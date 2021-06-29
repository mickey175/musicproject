import './App.css';
import Musictool from "./components/p5-scetch.js";
import {useEffect, useState, setState} from "react";
import io from 'socket.io-client';
import SongPanel from "./components/songPanel";

const ioClient = io.connect('http://localhost:8090');

function App() {

    useEffect(() => {
        ioClient.on('incoming', (songData) => {
            console.log(songData)
            setState({
                title: songData.title,
                subtitle: songData.subtitle,
                isData:true  })
        } );
    });

    const initialState = {
        title: "unknown",
        subtitle: "unknown",
        isData: false

    };

    const [state, setState] = useState(initialState);

    return (
    <div className="App">
        <p className={"headline"}>Music recognition and visualization</p>
        <canvas id="audioVis" className={state.isData ? 'audioHid' : 'audioVis'} height="500" width="1400"/>
        <SongPanel title={state.title} subtitle={state.subtitle} className={state.isData ? 'audioVis' : 'audioHid'}/>
        <Musictool />
    </div>
  );
}

export default App;
