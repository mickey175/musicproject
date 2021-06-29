import React from "react";
import styles from "./songPanelStyle.css"

export default function SongPanel(props) {

    return(
        <div>
            <p>{props.title}</p>
            <p>{props.subtitle}</p>
        </div>
    );
}