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
