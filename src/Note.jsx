import React from 'react';
import PropTypes from 'prop-types';
import { css, withStyles, withStylesPropTypes } from 'with-styles';
import themeColors from './theme/color';

class Note extends React.PureComponent {
  render() {
    const { name, noteColor, octave, styles } = this.props;

    const colorStyle = {
      color: noteColor,
    };

    return (
      <div {...css(styles.note)}>
        <span {...css(styles.name, colorStyle)}>{name[0]}</span>
        <span {...css(styles.nameSuffix, colorStyle)}>{name[1]}</span>
        <span {...css(styles.nameSuffix, colorStyle)}>{octave}</span>
      </div>
    );
  }
}

Note.propTypes = {
  ...withStylesPropTypes,
  name: PropTypes.string.isRequired,
  octave: PropTypes.number.isRequired,
  noteColor: PropTypes.string,
};

Note.defaultProps = {
  noteColor: themeColors.note,
};

export default withStyles(({ unit }) => ({
  note: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: unit * 3,
  },
  name: {
    fontSize: unit * 16,
    fontWeight: '600',
  },
  nameSuffix: {
    fontSize: unit * 4,
  },
}))(Note);
