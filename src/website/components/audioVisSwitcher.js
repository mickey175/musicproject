import AudioBar from "./d3AudioBar";
import AudioDots from "./d3AudioDots";
import AudioCircle from "./d3AudioCircle";

export default function AudioVisualSwitcher(props) {
    console.log(props.isData)
    if(props.activeTool === 3 && !props.isData){
        return <AudioBar />
    }else if(props.activeTool === 2 && !props.isData){
        return <AudioDots />
    }else if(props.activeTool === 1 && !props.isData){
        return <AudioCircle />
    }else{
        return null
    }
}
