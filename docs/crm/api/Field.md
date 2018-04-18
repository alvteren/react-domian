# \<Field \/\>

```jsx
<Field id="uf_location" edit={true} />
```

## id:string

A string field id. This props using for obtain field data from redux store.

## entityId: string

CRM entity id. One of **objects**, **lead** @todo rename objects to sale

## edit: boolean

Mode of view: edit or view

## Structure field data on redux store

### id: string

A string field id.

### label: string

A string field label

### required: boolean

Field indication required or not for fill value

### multiple: boolean

For example, few checkboxes

### items: Object

Contains object with all options

```json
{
  "items": {
    "123": {
      "label": "Field name for users",
      "value": "123"
    },
    "1234": {
      "label": "Field name for users 2",
      "value": "1234"
    }
  }
}
```

Sample with depended. There is field with id = "subfield" depend on field with id = "field".
**link** has values of "field" in which that field vissible.

#### In Russian

Пример объекта поля с id = "subfield" с зависимостью от значений поля с id = "field".
**link** содержит значения "field" при которых поле отображается

```json
{
  "id": "subfield",
  "depended": "field",
  "link": ["field_1", "field_2"],
  "items": {
    "123": {
      "label": "Field name for users",
      "value": "123"
    },
    "1234": {
      "label": "Field name for users 2",
      "value": "1234"
    }
  }
}
```

More one sample with depended. **exсlude_link** has values of "field" in which that field hidden.
**exсlude_link** has values of "field" in which that field hidden.

#### In Russian

Еще один пример объекта поля с зависимостью.
**exсlude_link** содержит значения "field" при которых поле скрывается

```json
{
  "id": "subfield",
  "depended": "field",
  "exсlude_link": ["field_1", "field_2"],
  "items": {
    "123": {
      "label": "Field name for users",
      "value": "123"
    },
    "1234": {
      "label": "Field name for users 2",
      "value": "1234"
    }
  }
}
```

Sample with depended vissible values. **link** has values of "field" in which that value vissible.
**link** has values of "field" in which that values vissible. If every values will not vissible, then field will hide.

#### In Russian

Пример объекта поля с зависимостью показа значений поля.
**link** содержит значения "field" при которых значение показывается. Если ни одно значение не отображается, то поле скрывается полностью.

```json
{
  "id": "subfield",
  "depended": "field",
  "items": {
    "123": {
      "label": "Field name for users",
      "value": "123",
      "link": ["field_1", "field_2"]
    },
    "1234": {
      "label": "Field name for users 2",
      "value": "1234",
      "link": ["field_1", "field_3"]
    }
  }
}
```

Sample with depended hidden values. **exсlude_link** has values of "field" in which that value hidden.
**exсlude_link** has values of "field" in which that values hidden. If every values hidden, then field will hide.

#### In Russian

Пример объекта поля с зависимостью показа значений поля.
**exсlude_link** содержит значения "field" при которых значение скрывается. Если все значения поля скрываются, то поле скрывается полностью.

```json
{
  "id": "subfield",
  "depended": "field",
  "items": {
    "123": {
      "label": "Field name for users",
      "value": "123",
      "exсlude_link": ["field_1", "field_2"]
    },
    "1234": {
      "label": "Field name for users 2",
      "value": "1234",
      "exсlude_link": ["field_1", "field_3"]
    }
  }
}
```

### type: string

A string field type. Possible variants for edit mode:

* **text, tel, email** - render to material-ui component `<TextField type={type} />`@todo Need make for **tel** variant the mask by Russian phone format +7 (999) 999-99-99
* **textarea** - will render to material-ui component `<TextField type="text" multiline rowsMax="4" />`
* **image** - will render to special component [`<FieldEditImage />`](../../../src/crm/Field/edit/Image.jsx)
* **location** - will render to special component [`<FieldEditLocation />`](../../../src/crm/Field/edit/Location/index.jsx)
* **select** - will render to material-ui component `<Select />`. If options of value more 4 then `<Select native={true} />` for improvement perfomance
* **switch** - will render to material-ui component `<Switch />`
* **checkbox** - will render to material-ui component `<Checkbox />` @todo Need make this variant
* @todo **custom** - will render to component from parametr _component_ of field data

### component: string

A string Component name. Field will render to component from this parametr. On this component will give all props and state from component `<Field />`. And will give functions onStartEdit, onSave, onChange
