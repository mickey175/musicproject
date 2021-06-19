import record from 'node-mic-record'
import {getWfReader} from "./voskMicRec.js";

record.start({
    sampleRate : 44100,
    recordProgram: 'arecord',
    verbose : true
}).pipe(getWfReader())

setTimeout(function () {
    record.stop()
}, 3000)