import './App.css';
import Musictool from "./p5-scetch";
import {useEffect, useState, setState} from "react";
import io from 'socket.io-client';
const ioClient = io.connect('http://localhost:8090');

function App() {
    useEffect(() => {
        ioClient.on('incoming', (text) => {
            setState({ test:text  })
        } );
    });

    const initialState = {
        test: 'unknown'
    };

    const [state, setState] = useState(initialState);

    return (
    <div className="App">
        <p className={"headline"}>Music recognition and visualization</p>
        <canvas id="audioVis" className={"audioVis"} height="500" width="1400"/>
        <p>Hier steht das Lied:{state.test}</p>
        <Musictool/>
    </div>
  );
}

export default App;
