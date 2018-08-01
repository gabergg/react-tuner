import React from 'react';
import PropTypes from 'prop-types';
import { css, withStyles, withStylesPropTypes } from 'with-styles';

class Note extends React.PureComponent {
  render() {
    const { name, octave, styles } = this.props;

    return (
      <div {...css(styles.note)}>
        <span {...css(styles.name)}>{name[0]}</span>
        <span {...css(styles.nameSuffix)}>{name[1]}</span>
        <span {...css(styles.nameSuffix)}>{octave}</span>
      </div>
    );
  }
}

Note.propTypes = {
  ...withStylesPropTypes,
  name: PropTypes.string.isRequired,
  octave: PropTypes.number.isRequired,
};

export default withStyles(({ color, unit }) => ({
  note: {
    width: 110,
    height: 146,
    marginBottom: 10,
  },
  name: {
    fontSize: unit * 16,
    fontWeight: '600',
    color: color.note,
    flexDirection: 'row',
  },
  nameSuffix: {
    fontSize: unit * 4,
    color: color.note,
  },
}))(Note);
