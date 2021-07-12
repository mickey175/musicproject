import React from "react";
import styles from "./songPanelStyle.css"

export default function SongPanel(props) {

    if(props.isData === true) {
        return (
            <div className="songInfoVis">
                <img
                    src={props.url}
                    alt="songIMG"
                />
                <div className={"h3-position"}>
                    <table>
                        <tr>
                            <th>Künstler</th>
                            <td>{props.subtitle}</td>
                        </tr>
                        <tr>
                            <th>Titel</th>
                            <td>{props.title}</td>
                        </tr>
                    </table>
                </div>
            </div>
        );
    }else {
        return null
    }
}