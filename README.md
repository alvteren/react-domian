# react-domian

Декомпозиция

неправильно

```JavaScript
export default const Toolbar = ({ numSelected, classes }) => {
```

правильно

```JavaScript
export default const Toolbar = props => {
  const { numSelected, classes } = props;
```

Folder **/src/api** has scripts for working with server api

Modules list:

* aliance - contain component for working with aliances
* crm - contain component for working with CRM
* desktop
* user

Every module contain folder **reducers**, **actions**
