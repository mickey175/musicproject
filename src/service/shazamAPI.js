import unirest from 'unirest';
import {client, emitter} from "./socket.js";
import * as dot from "dotenv"
const auth = {
    key: dot.config().parsed.XRAPIDAPIKEY,
    host: dot.config().parsed.XRAPIDAPIHOST
};

export function fetchShazamDataByText(lyrics) {
    const req = unirest("GET", "https://shazam.p.rapidapi.com/search");

    console.log("Fetching the Audio Information...")
    req.query({
        "term": lyrics,
        "locale": "en-US",
        "offset": "0",
        "limit": "5"
    });

    req.headers({
        "x-rapidapi-key": auth.key,
        "x-rapidapi-host": auth.host,
        "useQueryString": true
    });

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        emitter.emit('incoming', parseJSON(res.body));
        console.log(res.body);
    });
}

export function fetchShazamDataByBase64(audioFingerprint){
    const req = unirest("POST", "https://shazam.p.rapidapi.com/songs/detect");

    req.headers({
        "content-type": "text/plain",
        "x-rapidapi-key": auth.key,
        "x-rapidapi-host": auth.host,
        "useQueryString": true
    });
    console.log("Fetching the Audio Information...")
    req.send(audioFingerprint);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        client.emit('incoming', parseJSON(res.body));
        return res.body;
    });
}

function parseJSON(jsonSong){
    let title = jsonSong.track.title;
    let subtitle = jsonSong.track.subtitle;
    let jsonSongInformation = {
        title: title,
        subtitle: subtitle,
    }
    return jsonSongInformation;
}
