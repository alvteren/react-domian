# react-domian

Read style guide [https://github.com/airbnb/javascript/tree/master/react](https://github.com/airbnb/javascript/tree/master/react)

## Basic rules and recomdation

### Decomposition

Bad

```jsx
export default const Toolbar = ({ numSelected, classes }) => {
```

Good

```jsx
export default const Toolbar = props => {
  const { numSelected, classes } = props;
```

If you need to bind one handler function with arguments
Bad

```jsx
handlerClick = (arg) => {
  //handle
}
render(){
  return <TestComponent onClick={()=>{handlerClick(arg)}};
}
```

Good

```jsx
handlerClick = () = (arg) => {
  //handle
}
render(){
  return <TestComponent onClick={handlerClick(arg)};
}
```

## Rules of Domianix app

### Modules

Folder [`/src/api`](https://github.com/alvteren/react-domian/tree/master/src/api) has scripts for working with server api.

Every module has own folder.

Modules list:

* aliance - contain components for working with aliances
* crm - contain components for working with CRM
* desktop - contain components for working with Desktop of application
* user - containt components for working with users
* app - contain components and utils for whole application
* util - contain useful functions, doesn't contain react components

Every module contain folder **reducers**, **actions**
