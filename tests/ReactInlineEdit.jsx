import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount } from 'enzyme';
import InlineEdit from '../src/index';

Enzyme.configure({ adapter: new Adapter() });

const tagCSS = '.inline-edit .tag-wrapper';
const inputCSS = '.inline-edit .input-wrapper';
const cancelCSS = '.inline-edit .input-wrapper .actions button.cancel';
const saveCSS = '.inline-edit .input-wrapper .actions button.save';

test('InlineEdit mounts with default values', () => {
  const wrapper = mount(<InlineEdit/>);

  expect(wrapper.prop('value')).toEqual('');
  expect(wrapper.prop('tag')).toEqual('span');
  expect(wrapper.prop('type')).toEqual('text');
  expect(wrapper.prop('onSave')).toBe(null);
  expect(wrapper.prop('updateOnNewProps')).toBe(false);
  expect(wrapper.prop('min')).toEqual(undefined);
  expect(wrapper.prop('max')).toEqual(undefined);
});

test('InlineEdit should start with the value displayed', () => {
  const wrapper = mount(
    <InlineEdit
      value="placeholder"
      tag="p"
    />
  );

  expect(wrapper.prop('value')).toEqual('placeholder');
  expect(wrapper.prop('tag')).toEqual('p');
  expect(wrapper.prop('type')).toEqual('text');
  expect(wrapper.prop('onSave')).toBe(null);
  expect(wrapper.prop('updateOnNewProps')).toBe(false);

  const value = wrapper.find('.inline-edit p');
  expect(value.text()).toEqual('placeholder');
});

test('InlineEdit should change to input on click', () => {
  const wrapper = mount(
    <InlineEdit
      value="placeholder"
      tag="p"
    />
  );

  expect(wrapper.prop('value')).toEqual('placeholder');
  expect(wrapper.prop('tag')).toEqual('p');
  expect(wrapper.prop('type')).toEqual('text');
  expect(wrapper.prop('onSave')).toBe(null);
  expect(wrapper.prop('updateOnNewProps')).toBe(false);

  let value = wrapper.find(tagCSS);
  let input = wrapper.find(inputCSS);
  expect(value.text()).toEqual('placeholder');
  expect(input.length).toEqual(0);

  value.simulate('click');
  value = wrapper.find(tagCSS);
  input = wrapper.find(inputCSS);
  expect(value.length).toEqual(0);
  expect(input.length).toEqual(1);
});

test('InlineEdit should change input values on type', () => {
  const wrapper = mount(
    <InlineEdit
      value="placeholder"
      tag="p"
      type="input"
    />
  );

  expect(wrapper.state().value).toEqual('placeholder');
  const value = wrapper.find(tagCSS);
  value.simulate('click');

  const input = wrapper.find(`${inputCSS} input`);
  input.simulate('change', { target: { value: 'newvalue' } });
  expect(wrapper.state().value).toEqual('newvalue');
});

test('InlineEdit should close and revert values on cancel', () => {
  const wrapper = mount(
    <InlineEdit
      value="placeholder"
      tag="p"
    />
  );

  expect(wrapper.state().value).toEqual('placeholder');
  const value = wrapper.find(tagCSS);
  value.simulate('click');

  const input = wrapper.find(`${inputCSS} input`);
  input.simulate('change', { target: { value: 'newvalue' } });
  expect(wrapper.state().value).toEqual('newvalue');

  const cancel = wrapper.find(cancelCSS);
  cancel.simulate('click');
  expect(wrapper.state().value).toEqual('placeholder');
});

test('InlineEdit should close and trigger callback on save', () => {
  const onSave = jest.fn();
  const wrapper = mount(
    <InlineEdit
      value="placeholder"
      tag="p"
      onSave={onSave}
    />
  );

  expect(wrapper.state().value).toEqual('placeholder');
  const value = wrapper.find(tagCSS);
  value.simulate('click');

  const input = wrapper.find(`${inputCSS} input`);
  input.simulate('change', { target: { value: 'newvalue' } });
  expect(wrapper.state().value).toEqual('newvalue');

  const save = wrapper.find(saveCSS);
  save.simulate('click');
  expect(wrapper.state().value).toEqual('newvalue');
  expect(onSave).toHaveBeenCalledWith('newvalue');
});

test('InlineEdit should updated props if flag is set', () => {
  const onSave = jest.fn();
  const wrapper = mount(
    <InlineEdit
      value="placeholder"
      tag="p"
      onSave={onSave}
    />
  );

  expect(wrapper.state().value).toEqual('placeholder');
  const value = wrapper.find(tagCSS);
  value.simulate('click');

  const input = wrapper.find(`${inputCSS} input`);
  input.simulate('change', { target: { value: 'newvalue' } });
  expect(wrapper.state().value).toEqual('newvalue');

  const save = wrapper.find(saveCSS);
  save.simulate('click');
  expect(wrapper.state().value).toEqual('newvalue');
  expect(onSave).toHaveBeenCalledWith('newvalue');
});

test('InlineEdit should min and max dates', () => {
  const onSave = jest.fn();
  const wrapper = mount(
    <InlineEdit
      onSave={onSave}
      type="date"
      value="2019-01-15"
      minDate="2019-01-01"
      maxDate="2019-01-31"
    />
  );

  expect(wrapper.state().value).toEqual('2019-01-15');
  const value = wrapper.find(tagCSS);
  value.simulate('click');
  const input = wrapper.find('input');
  expect(input.props().min).toEqual('2019-01-01');
  expect(input.props().max).toEqual('2019-01-31');
});
