export default class DelayedAction {
  timer = null;
  do = (func, wait = 500) => {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      func();
    }, wait);
  };
}
