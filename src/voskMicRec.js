import * as vosk from 'vosk';
import { Readable } from 'stream';
import { Reader } from 'wav';
import { existsSync, createWriteStream } from 'fs';
import { fetchShazamDataByText } from "./shazamAPI.js"

const MODEL_PATH = 'model';
const SAMPLE_RATE = 16000;



if (!existsSync(MODEL_PATH)) {
    console.log("Please download the model from https://alphacephei.com/vosk/models and unpack as " + MODEL_PATH + " in the current folder.")
    process.exit()
}

vosk.setLogLevel(0);
const model = new vosk.Model(MODEL_PATH);
const rec = new vosk.Recognizer({model: model, sampleRate: SAMPLE_RATE});

export const getWfReader = () => {
    const wfReader = new Reader();
    const wfReadable = new Readable().wrap(wfReader);

    wfReader.on('format', async ({ sampleRate }) => {
        const rec = new vosk.Recognizer({
            model: model,
            sampleRate: sampleRate,
        });
        for await (const data of wfReadable) {
            rec.acceptWaveform(data);
        }
        let convertedText = rec.finalResult().text
        console.log("Text: "+convertedText)
        fetchShazamDataByText(convertedText)
        //emitter.emit('result', rec.finalResult().text);
        rec.free();
    });
    return wfReader;
};
