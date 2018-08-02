import React from 'react';
import PropTypes from 'prop-types';
import { css, withStyles, withStylesPropTypes } from 'with-styles';

const scaleStyle = {
  width: '1px',
  height: '100%',
  transformOrigin: 'bottom',
  boxSizing: 'border-box',
  borderTop: '10px solid',
  position: 'absolute',
  right: '50%',
};

const strongStyle = {
  width: 2,
  borderTopWidth: 20,
};

class Scales extends React.PureComponent {
  render() {
    const { styles } = this.props;

    const scales = [];
    for (let i = 0; i < 11; i++) {
      const rotationStyle = { transform: `rotate(${i * 9 - 45}deg)` };
      scales.push(
        <div key={i} {...css(styles.scale, rotationStyle, i % 5 === 0 && styles.strong)} />
      );
    }
    return scales;
  }
}

Scales.propTypes = withStylesPropTypes;

const StyledScales = withStyles(() => ({
  scale: scaleStyle,
  strong: strongStyle,
}))(Scales);

// eslint-disable-next-line react/no-multi-comp
class Meter extends React.PureComponent {
  render() {
    const { cents, styles } = this.props;

    const centDegrees = cents * 45 / 50;

    const pointerStyle = {
      transform: `rotate(${centDegrees}deg)`,
    };

    return (
      <div {...css(styles.meter)}>
        <div {...css(styles.origin)} />
        <div {...css(styles.scale, styles.strong, styles.pointer, pointerStyle)} />
        <StyledScales />
      </div>
    );
  }
}

Meter.propTypes = {
  ...withStylesPropTypes,
  cents: PropTypes.number,
};

Meter.defaultProps = {
  cents: 0,
};

export default withStyles(() => ({
  meter: {
    position: 'absolute',
    left: '0',
    right: '0',
    bottom: '50%',
    width: '400px',
    height: '33%',
    margin: '0 auto 5vh auto',
  },
  origin: {
    width: '10px',
    height: '10px',
    background: '#2c3e50',
    borderRadius: '50%',
    position: 'absolute',
    bottom: '-5px',
    right: '50%',
    marginRight: '-4px',
  },
  pointer: {
    width: '2px',
    height: '100%',
    background: '#2c3e50',
    transformOrigin: 'bottom',
    transition: 'transform 0.5s',
    position: 'absolute',
    right: '50%',
  },
  scale: scaleStyle,
  strong: strongStyle,
}))(Meter);
