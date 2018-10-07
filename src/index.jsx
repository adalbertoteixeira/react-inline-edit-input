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
    this.state = {
      value: props.format ? props.format(props.value) : props.value,
      edit: false,
    };

    this.toggleMode = this.toggleMode.bind(this);
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.change = this.change.bind(this);
    this.input = React.createRef();
  }

  /**
   * @param  {any} value passed in.
   * @param  {function} format Function used to format value.
   * @return {any} initial value or formated value
   */
  getValue(value, format) {
    if (!format) {
      return value;
    }

    return format(value);
  }

  /**
   * @param  {object} nextProps Props sent by the parent component.
   * @return {void}
   */
  componentDidUpdate() {
    const {
      updateOnNewProps,
      value,
      format,
    } = this.props;

    if (!updateOnNewProps) {
      return;
    }

    this.setState({
      value: this.getValue(value, format),
    });
  }

  /**
   * Toggle Edit and view modes
   * @param  {boolean} edit
   * @return {void}
   */
  toggleMode(edit) {
    this.setState({ edit }, () => {
      if (edit && this.input.current) {
        this.input.current.focus();
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
      format,
      getValue,
    } = this.props;

    this.setState({
      value: getValue(ev.target.value, format),
    });
  }

  /**
   * @return {void}
   */
  render() {
    const {
      tag,
      type,
    } = this.props;

    const Tag = tag;
    const Input = type === 'textarea' ? 'textarea' : 'input';

    return (
      <div className="inline-edit" style={styles.inlineEdit}>
        {this.state.edit ?
          <div className="input-wrapper" style={styles.inputWrapper}>
            <Input
              style={styles.inputWrapperInput}
              type={this.props.type}
              value={this.state.value}
              onChange={this.change}
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
            ref={this.input}
            className="tag-wrapper"
            onClick={() => this.toggleMode(true)}
          >
            {this.state.value}
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
};

export default InlineEdit;
