import { EventEmitter } from 'events';

const constraints = { audio: {
  mandatory: {
    googEchoCancellation: false,
    googAutoGainControl: false,
    googNoiseSuppression: false,
    googHighpassFilter: false,
  },
} };

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
  constructor(bufferSize = 2048) {
    super();
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    this.initializeMediaStream();
  }

  initializeMediaStream = async () => {
    try {
      const userMediaStream = await getUserMedia();
      this.emit('ready', userMediaStream);
      this.audioContext.createMediaStreamSource(userMediaStream).connect(this.analyser);
      this.analyser.connect(this.scriptProcessor);
      this.scriptProcessor.connect(this.audioContext.destination);
    } catch (error) {
      console.trace();
    }
  }

  handleAudioEvent = (event) => {
    if (this.listenerCount('data') > 0) {
      const audioBuffer = event.inputBuffer.getChannelData(0);
      this.emit('data', audioBuffer);
    }
  }

  start() {
    this.scriptProcessor.addEventListener('audioprocess', this.handleAudioEvent);
    this.emit('start');
  }

  stop() {
    this.scriptProcessor.removeEventListener('audioprocess', this.handleAudioEvent);
    this.emit('stop');
  }
}
