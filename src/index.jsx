import React, { PureComponent } from 'react';
import {
  func, string, oneOfType, number, bool,
} from 'prop-types';

const styles={
  inlineEdit: {
    textDecoration: 'underline dotted',
    cursor: 'pointer',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputWrapperInput: {
    width: '100%',
    margin: 0,
    padding: '.5rem',
  },
  inputWrapperActions: {
    position: 'absolute',
    width: '100%',
    display: 'flex',
    color: 'white',
  },
  inputWrapperActionsButton: {
    flex: '0 0 50%',
    border: 'none',
    padding: '.5rem',
    color: 'white',
    textTransform: 'uppercase',
  },
};

const getValueByType = (value, type) => {
  if (type === 'number') {
    try {
      const number = Number(value);
      if (Number.isNaN(number)) {
        return null;
      }

      return number;
    } catch (e) {
      return value;
    }
  }

  return value;
};

/**
 * @param  {any} value passed in.
 * @param  {function} format Function used to format value.
 * @return {any} initial value or formated value
 */
const getFormatedValue = (value, format) => {
  if (!format) {
    return value;
  }

  return format(value);
};

/**
 * InlineEdit component
 */
class InlineEdit extends PureComponent {
  /**
   * Component constructor
   * @param  {object} props initial props
   * @return {void}
   */
  constructor(props) {
    super(props);
    const {
      value,
      type,
    } = this.props;
    const valueToUse = getValueByType(value, type);

    this.state = {
      value: valueToUse,
      edit: false,
    };

    this.toggleMode = this.toggleMode.bind(this);
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.change = this.change.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.inputRef = React.createRef();
  }

  /**
   * If pressing Enter or Escape save and close or close.
   * @param {ev} ev - on key down event
   * @return {void}
   */
  handleKeyDown(ev) {
    if (ev.key === 'Enter') {
      this.save();
      return;
    }

    if (ev.key === 'Escape') {
      this.cancel();
      return;
    }
  }

  /**
   * @param  {object} nextProps Props sent by the parent component.
   * @return {void}
   */
  componentDidUpdate() {
    const {
      updateOnNewProps,
      value,
    } = this.props;

    const {
      edit,
    } = this.state;

    if (!updateOnNewProps) {
      return;
    }

    if (edit) {
      return;
    }

    this.setState({
      value: value,
    });
  }

  /**
   * Toggle Edit and view modes
   * @param  {boolean} edit
   * @return {void}
   */
  toggleMode(edit) {
    this.setState({ edit }, () => {
     if (edit && this.inputRef && this.inputRef.current) {
        this.inputRef.current.focus();
      }
    });
  }

  /**
   * @return {void}
   */
  save() {
    this.setState({
      edit: false,
    }, () => this.props.onSave(this.state.value));
  }

  /**
   * @return {void}
   */
  cancel() {
    this.setState({
      edit: false,
      value: this.props.value,
    });
  }

  /**
   * @param  {object} ev Event returned by the input
   * @return {void}
   */
  change(ev) {
    const {
      type,
    } = this.props;
    this.setState({
      value: getValueByType(ev.target.value, type),
    });
  }

  /**
   * @return {void}
   */
  render() {
    const {
      tag,
      type,
      format,
      minDate,
      maxDate,
    } = this.props;

    const {
      value,
    } = this.state;

    const Tag = tag;
    const Input = type === 'textarea' ? 'textarea' : 'input';
    const additionalProps = {};

    if (type === 'date') {
      additionalProps.min = minDate;
      additionalProps.max = maxDate;
    }

    return (
      <div className="inline-edit" style={styles.inlineEdit}>
        {this.state.edit ?
          <div className="input-wrapper" style={styles.inputWrapper}>
            <Input
              onKeyDownCapture={this.handleKeyDown}
              ref={this.inputRef}
              style={styles.inputWrapperInput}
              type={this.props.type}
              value={this.state.value}
              onChange={this.change}
              {...additionalProps}
            />
            <div className="actions" style={styles.inputWrapperActions}>
              <button
                style={{
                  ...styles.inputWrapperActionsButton,
                  backgroundColor: this.props.saveColor,
                }}
                className="save"
                onClick={this.save}
              >{this.props.saveLabel}</button>
              <button
                style={{
                  ...styles.inputWrapperActionsButton,
                  backgroundColor: this.props.cancelColor,
                }}
                className="cancel"
                onClick={this.cancel}
              >{this.props.cancelLabel}</button>
            </div>
          </div> :
          <Tag
            className="tag-wrapper"
            onClick={() => this.toggleMode(true)}
          >
            {
              getFormatedValue(value, format)
            }
          </Tag>
        }
      </div>
    );
  }
}

InlineEdit.propTypes = {
  value: oneOfType([string, number]),
  format: func,
  tag: string,
  type: string,
  onSave: func,
  updateOnNewProps: bool,
  saveColor: string,
  saveLabel: string,
  cancelColor: string,
  cancelLabel: string,
  getValue: func,
};

InlineEdit.defaultProps = {
  value: '',
  format: null,
  tag: 'span',
  type: 'text',
  onSave: null,
  updateOnNewProps: false,
  saveColor: 'blue',
  saveLabel: 'Save',
  cancelColor: 'red',
  cancelLabel: 'Cancel',
  getValue: null,
  minDate: '',
  maxDate: '',
};

export default InlineEdit;
