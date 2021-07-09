import AudioBar from "./d3AudioBar";
import AudioDots from "./d3AudioDots";
import AudioCircle from "./d3AudioCircle";

export default function AudioVisualSwitcher(props) {

    if(props.activeTool === 3){
        return <AudioBar/>
    }else if(props.activeTool === 2){
        return <AudioDots/>
    }else if(props.activeTool === 1){
        return <AudioCircle/>
    }
}
