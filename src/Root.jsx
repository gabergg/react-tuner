
import React from 'react';
import { withStyles, css, withStylesPropTypes } from 'with-styles';

import Tuner from './tuner';
import Note from './Note';
import Meter from './Meter';

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
    this.tuner.onNoteDetected = note => {
      if (this.lastNoteName === note.name) {
        this.setState({ note });
      } else {
        this.lastNoteName = note.name;
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isRecording && !prevState.isRecording) {
      this.tuner.start();
    }
    if (prevState.isRecording && !this.state.isRecording) {
      this.tuner.stop();
    }
  }

  toggleRecording = () => {
    this.setState({ isRecording: !this.state.isRecording });
  }

  render() {
    const { isRecording } = this.state;
    const { styles } = this.props;

    console.log(isRecording);

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
