# React Inline Edit

# Usage

```
  <InlineEdit
    value={fish.name}
    tag="p"
    type="text"
    saveLabel="Gravar"
    cancelLabel="Cancelar"
    onSave={value => props.updateFish(fish.id, { name: value })}
  />
```
## Properties

| Name | Type | Default | Description |
| :--- | :--- | :------ | :---------- |
| updateOnNewProps | boolean | false | Props will only be updated if this is set to true |
| format | function | null | Formats the value according to the function supplied |
| value | string | '' | initial input value |
| tag | string | 'span' | |
| type | string |'text' | |
| onSave | string | null | |
| updateOnNewProps | string | false | |
| saveColor | string | 'blue' | |
| saveLabel | string | 'Save' | |
| cancelColor | string | 'red' | |
| cancelLabel | string | 'Cancel' | |
| minDate | string | '' | |
| maxDate | string | '' | |
