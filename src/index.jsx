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
      value: props.value,
      edit: false,
    };

    this.toggleMode = this.toggleMode.bind(this);
    this.cancel = this.cancel.bind(this);
    this.save = this.save.bind(this);
    this.change = this.change.bind(this);
  }

  /**
   * @param  {object} nextProps Props sent by the parent component.
   * @return {void}
   */
  componentWillReceiveProps(nextProps) {
    if (!this.props.updateOnNewProps) {
      return;
    }

    this.setState({
      value: nextProps.value,
    });
  }

  /**
   * Toggle Edit and view modes
   * @param  {boolean} edit
   * @return {void}
   */
  toggleMode(edit) {
    this.setState({ edit });
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
    this.setState({
      value: ev.target.value,
    });
  }

  /**
   * @return {void}
   */
  render() {
    const Tag = this.props.tag;
    const Input = this.props.type ? 'textarea' : this.props.type;


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
  tag: string,
  type: string,
  onSave: func,
  updateOnNewProps: bool,
  saveColor: string,
  saveLabel: string,
  cancelColor: string,
  cancelLabel: string,
};

InlineEdit.defaultProps = {
  value: '',
  tag: 'span',
  type: 'text',
  onSave: null,
  updateOnNewProps: false,
  saveColor: 'blue',
  saveLabel: 'Save',
  cancelColor: 'red',
  cancelLabel: 'Cancel',
};

export default InlineEdit;
