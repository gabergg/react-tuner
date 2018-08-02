import React from 'react';
import PropTypes from 'prop-types';
import { css, withStyles, withStylesPropTypes } from 'with-styles';
import themeColors from './theme/color';

const scaleStyle = {
  width: '1px',
  height: '100%',
  transformOrigin: 'bottom',
  boxSizing: 'border-box',
  position: 'absolute',
  right: '50%',
};

const strongStyle = {
  width: 2,
  borderTopWidth: 20,
};

class Scales extends React.PureComponent {
  render() {
    const { scaleColor, styles } = this.props;

    const extraScaleStyle = {
      borderTop: `10px solid ${scaleColor}`,
    };

    const scales = [];
    for (let i = 0; i < 11; i++) {
      const rotationStyle = { transform: `rotate(${i * 9 - 45}deg)` };
      scales.push(
        <div
          key={i}
          {...css(styles.scale, rotationStyle, i % 5 === 0 && styles.strong, extraScaleStyle)}
        />
      );
    }
    return scales;
  }
}

Scales.propTypes = {
  ...withStylesPropTypes,
  scaleColor: PropTypes.string.isRequired,
};

const StyledScales = withStyles(() => ({
  scale: scaleStyle,
  strong: strongStyle,
}))(Scales);

// eslint-disable-next-line react/no-multi-comp
class Meter extends React.PureComponent {
  render() {
    const { cents, pointerColor, scaleColor, styles } = this.props;

    const centDegrees = cents * 45 / 50;

    const pointerStyle = {
      transform: `rotate(${centDegrees}deg)`,
      backgroundColor: pointerColor,
    };

    return (
      <div {...css(styles.meter)}>
        <div {...css(styles.origin, pointerStyle)} />
        <div {...css(styles.scale, styles.strong, styles.pointer, pointerStyle)} />
        <StyledScales scaleColor={scaleColor} />
      </div>
    );
  }
}

Meter.propTypes = {
  ...withStylesPropTypes,
  cents: PropTypes.number,
  pointerColor: PropTypes.string,
  scaleColor: PropTypes.string,
};

Meter.defaultProps = {
  cents: 0,
  pointerColor: themeColors.meter,
  scaleColor: themeColors.meter,
};

export default withStyles(() => ({
  meter: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    height: '50%',
  },
  origin: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    position: 'absolute',
    bottom: '-5px',
    right: '50%',
    marginRight: '-4px',
  },
  pointer: {
    zIndex: 1,
    width: '2px',
    height: '100%',
    transformOrigin: 'bottom',
    transition: 'transform 0.5s',
    position: 'absolute',
    right: '50%',
    borderTop: 0,
  },
  scale: scaleStyle,
  strong: strongStyle,
}))(Meter);
