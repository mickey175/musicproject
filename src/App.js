import './App.css';
import Musictool from "./p5-scetch";
import React from "react";

function App() {
  return (
    <div className="App">
        <p className={"headline"}>Music recognition and visualization</p>
        <canvas id="audioVis" className={"audioVis"} height="500" width="1400"/>
        <Musictool/>
    </div>
  );
}

export default App;
