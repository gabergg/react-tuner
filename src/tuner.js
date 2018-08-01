import PitchFinder from 'pitchfinder';
import Recorder from './recorder';

const allNotes = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const middleA = 440;
const semitone = 69;

// get musical note from frequency
function getNote(frequency) {
  const note = 12 * (Math.log(frequency / middleA) / Math.log(2));
  return Math.round(note) + semitone;
}

// get the musical note's standard frequency
function getStandardFrequency(note) {
  // eslint-disable-next-line no-restricted-properties
  return middleA * Math.pow(2, (note - semitone) / 12);
}

// get cents difference between given frequency and musical note's standard frequency
function getCents(frequency, note) {
  return Math.floor(1200 * Math.log(frequency / getStandardFrequency(note)) / Math.log(2));
}

export default class Tuner {
  constructor(sampleRate = 22050, bufferSize = 2048) {
    this.pitchFinder = new PitchFinder.YIN({ sampleRate });
    this.isRecorderReady = false;
    this.recorder = new Recorder(bufferSize);
    this.recorder.on('ready', this.onReady);
  }

  onReady = (recorder) => {
    console.log("we ready!!", recorder);
    this.isRecorderReady = true;
  }

  isReady() {
    return this.isRecorderReady;
  }

  start() {
    this.recorder.on('data', data => {
      const frequency = this.pitchFinder(data);
      if (frequency && this.onNoteDetected) {
        const note = getNote(frequency);
        this.onNoteDetected({
          name: allNotes[note % 12],
          value: note,
          cents: getCents(frequency, note),
          octave: parseInt(note / 12, 10) - 1,
          frequency,
        });
      }
    });
    this.recorder.start();
  }

  stop() {
    this.recorder.stop();
  }
}
