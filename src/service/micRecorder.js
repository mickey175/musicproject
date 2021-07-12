import record from 'node-mic-record'
import {fetchShazamDataByBase64, verboseMode} from "./shazamAPI.js";
import * as wav from "wav";
import {Readable} from "stream";
import * as fs from "fs";

export let fetchMicStream = () => {
    const wfReader = new wav.Reader({
        "channels": 1,
        "sampleRate": 44100,
        "bitDepth": 16
    });
    const wfReadable = new Readable().wrap(wfReader);

    var fileWriter = new wav.FileWriter('demo.wav', {
        channels: 1,
        sampleRate: 44100,
        bitDepth: 16
    });

    record.start({
        sampleRate : 44100,
        channels: 1,
        bits: 16,
        decode: null,
        verbose: false,
        recordProgram: 'arecord'
    }).pipe(fileWriter)

    wfReader.on('format', async () => {
        for await (const data of wfReadable) {
            // convert stream to base64...
        }
        //fetchShazamDataByBase64()
    });

    setTimeout(function () {
        record.stop()
        const wavEncoded = fs.readFileSync('demo.wav', {encoding: 'base64'});
        fetchShazamDataByBase64(wavEncoded);
    }, 2500)
}