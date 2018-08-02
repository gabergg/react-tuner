
import React from 'react';
import { withStyles, css, withStylesPropTypes } from 'with-styles';

import Tuner from './tuner';
import Note from './Note';
import Meter from './Meter';

// import Tuner from './tuner.worker';
// import RecorderWorker from 'worker-loader!./recorder.worker.js';

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isRecording: false,
      note: {
        name: 'A',
        octave: 4,
        frequency: 440,
      },
    };

    this.tuner = new Tuner();
  }

  componentDidMount() {
    // this.tuner.addEventListener('message', (msg) => console.log('Main received', msg));
    this.tuner.on('note', (note) => {
      if (this.lastNoteName === note.name) {
        this.setState({ note });
      } else {
        this.lastNoteName = note.name;
      }
    });

    // console.log(RecorderWorker);
    // const lol = new RecorderWorker();
    // console.log('lol :', lol);
    // lol.postMessage('hehe');
    // lol.onmessage = console.log;
    // lol.addEventListener('message', console.log);
    // lol.onmessage((msg) => console.log(msg));
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isRecording && !prevState.isRecording) {
      this.tuner.start();
    }
    if (prevState.isRecording && !this.state.isRecording) {
      this.tuner.stop();
    }
  }

  componentWillUnmount() {
    this.tuner.teardown();
  }

  toggleRecording = () => {
    this.setState({ isRecording: !this.state.isRecording });
  }

  render() {
    const { isRecording } = this.state;
    const { styles } = this.props;

    return (
      <div {...css(styles.container)}>
        <div style={{height: 200}} onClick={this.toggleRecording}>{`${isRecording}`}</div>
        <Meter cents={this.state.note.cents} />
        <Note {...this.state.note} />
        <span {...css(styles.frequency)}>
          {`${this.state.note.frequency.toFixed(1)} Hz`}
        </span>
      </div>
    );
  }
}

Root.propTypes = {
  ...withStylesPropTypes,
};

export default withStyles(({ color }) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: '400px',
  },
  frequency: {
    fontSize: 28,
    color: color.frequency,
  },
}))(Root);
