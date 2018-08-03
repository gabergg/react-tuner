
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, css, withStylesPropTypes } from 'with-styles';
import themeColors from './theme/color';

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
    this.tuner.on('note', (note) => {
      if (this.lastNoteName === note.name) {
        this.setState({ note });
      } else {
        this.lastNoteName = note.name;
      }
    });

    if (!this.props.Toggle) {
      this.startRecording();
    }
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

  startRecording = () => this.setState({ isRecording: true })

  stopRecording = () => this.setState({ isRecording: false })

  render() {
    const { isRecording } = this.state;
    const { styles, extraStyles, showFrequency, Toggle } = this.props;
    const {
      frequencyColor = themeColors.frequency,
      noteColor,
      pointerColor,
      scaleColor,
    } = extraStyles;

    return (
      <div {...css(styles.container)}>
        {Toggle && (
          <Toggle
            onStart={this.startRecording}
            onStop={this.stopRecording}
            isRecording={isRecording}
          />
        )}
        <Meter
          cents={this.state.note.cents}
          pointerColor={pointerColor}
          scaleColor={scaleColor}
        />
        <Note {...this.state.note} noteColor={noteColor} />
        { showFrequency && (
          <div {...css(styles.frequencyContainer)}>
            <span {...css(styles.frequency, frequencyColor && { color: frequencyColor })}>
              {`${this.state.note.frequency.toFixed(1)} Hz`}
            </span>
          </div>
        )}
      </div>
    );
  }
}

Root.propTypes = {
  ...withStylesPropTypes,
  extraStyles: PropTypes.object,
  showFrequency: PropTypes.bool,
  Toggle: PropTypes.node,
};

Root.defaultProps = {
  extraStyles: {},
  showFrequency: false,
  Toggle: null,
};

export default withStyles(() => ({
  container: {
    flex: 1,
    position: 'relative',
  },
  frequencyContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  frequency: {
    fontSize: 28,
  },
}))(Root);
