import record from 'node-mic-record'
import {getWfReader} from "./voskMicRec.js";
import {fetchShazamDataByBase64} from "./shazamAPI.js";
import {Reader} from "wav";
import {Readable} from "stream";
import base64 from "base-64";

const wfReader = new Reader();
const wfReadable = new Readable().wrap(wfReader);
let base64data = null;
record.start({
    sampleRate : 44100,
    channels: 1,
    bits: 16,
    encoding: "base64",
    recordProgram: 'rec'
}).pipe(wfReader)

wfReader.on('end', async () => {
    //wfReadable.setEncoding("utf8")
    for await (const data of wfReadable) {
        //base64data = base64.encode(data);
        //console.log(base64data)

        base64data = Buffer.from(data,"hex").toString("base64")
        //base64data = data;
    }
    fetchShazamDataByBase64(base64data)

});


setTimeout(function () {
    record.stop()
}, 2000)