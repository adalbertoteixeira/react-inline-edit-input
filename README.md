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

|name|type|default|description|
|updateOnNewProps|boolean|false|Props will only be updated if this is set to true|


