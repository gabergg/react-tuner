import { EventEmitter } from 'events';

const constraints = { audio: {
  mandatory: {
    googEchoCancellation: false,
    googAutoGainControl: false,
    googNoiseSuppression: false,
    googHighpassFilter: false,
  },
} };

const GAIN_THRESHOLD = 0.03;

async function getUserMedia() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const userMedia = await navigator.mediaDevices.getUserMedia(constraints);
      return userMedia;
    } catch (e) {
      console.error('Failed to load User Media', e);
    }
  }
  console.warn('Audio recording not supported by your web browser');
  return null;
}

export default class Recorder extends EventEmitter {
  constructor() {
    super();
    this.isReady = false;
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.analyser = this.audioContext.createAnalyser();
    this.initializeMediaStream();
  }

  initializeMediaStream = async () => {
    const userMediaStream = await getUserMedia();
    if (!userMediaStream) {
      return;
    }
    this.audioContext.createMediaStreamSource(userMediaStream).connect(this.analyser);
    this.analyser.fftSize = 4096;
    this.isReady = true;
    this.emit('ready', userMediaStream);
  }

  handleAudioEvent = () => {
    if (this.listenerCount('data') > 0) {
      const dataArray = new Float32Array(this.analyser.frequencyBinCount);
      // Can we use the frequency data for a more accurate guess?
      // this.analyser.getFloatFrequencyData(dataArray);
      this.analyser.getFloatTimeDomainData(dataArray);
      const max = Math.max(...dataArray);
      if (max > GAIN_THRESHOLD) {
        this.emit('data', dataArray);
      }
    }
  }

  start() {
    if (!this.isReady) {
      console.warn('Recorder is not ready to record');
    }
    this.audioInputInterval = setInterval(this.handleAudioEvent, 200);
    this.emit('start');
  }

  stop() {
    clearInterval(this.audioInputInterval);
    this.emit('stop');
  }
}
