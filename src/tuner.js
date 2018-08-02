import PitchFinder from 'pitchfinder';
import { EventEmitter } from 'events';
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

export default class Tuner extends EventEmitter {
  constructor() {
    super();
    this.isRecorderReady = false;
    this.isRunning = false;
    this.pitchFinder = new PitchFinder.AMDF();
    this.recorder = new Recorder();

    this.recorder.on('ready', () => {
      this.isRecorderReady = true;
    });

    this.recorder.on('start', () => {
      this.isRunning = true;
    });

    this.recorder.on('stop', () => {
      this.isRunning = false;
    });
  }

  get ready() {
    return this.isRecorderReady;
  }

  get running() {
    return this.isRunning;
  }

  start() {
    if (!this.isRecorderReady) {
      console.warn('Tuner is yet ready to start');
      return false;
    }

    this.recorder.on('data', (data) => {
      const frequency = this.pitchFinder(data);
      if (frequency && this.listenerCount('note')) {
        const note = getNote(frequency);
        this.emit('note', {
          name: allNotes[note % 12],
          value: note,
          cents: getCents(frequency, note),
          octave: parseInt(note / 12, 10) - 1,
          frequency,
        });
      }
    });

    this.recorder.start();
    return true;
  }

  stop() {
    if (!this.isRunning) {
      console.warn('Trying to stop tuner, but it isn\'t running');
      return false;
    }
    this.recorder.stop();
    return true;
  }

  teardown() {
    this.recorder.teardown();
  }
}
