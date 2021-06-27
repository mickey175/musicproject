import unirest from 'unirest';
import {createSocketServer} from "./socket.js";
import { EventEmitter } from 'events';
import * as dot from 'dotenv'

const client = createSocketServer();
const emitter = new EventEmitter();

let apiAuth = {
    key: dot.config().parsed.XRAPIDAPIKEY,
    host: dot.config().parsed.XRAPIDAPIHOST
}

export function fetchShazamDataByText(lyrics) {
    const req = unirest("GET", "https://shazam.p.rapidapi.com/search");

    req.query({
        "term": lyrics,
        "locale": "en-US",
        "offset": "0",
        "limit": "5"
    });

    req.headers({
        "x-rapidapi-key": apiAuth.key,
        "x-rapidapi-host": apiAuth.host,
        "useQueryString": true
    });


    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        emitter.emit('test', res.body);
        console.log(res.body);
    });
}

export function fetchShazamDataByBase64(audioFingerprint){
    const req = unirest("POST", "https://shazam.p.rapidapi.com/songs/detect");

    req.headers({
        "content-type": "text/plain",
        "x-rapidapi-key": apiAuth.key,
        "x-rapidapi-host": apiAuth.host,
        "useQueryString": true
    });
    console.log("Fetching the Audio Information...")
    req.send(audioFingerprint);

    req.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
        client.emit('incoming', JSON.stringify(res.body));
        return res.body;
    });
}
