export const inputNumber = {
  mounted(el: HTMLElement) {
    let _el: null | HTMLElement = el;
    if (_el.tagName.toLowerCase() !== 'input') _el = _el.querySelector('input');
    el?.addEventListener("keypress", function (evt: any) {
      const theEvent = evt;
      let key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
      const regex = /[0-9]|\./;
      if (!regex.test(key)) {
        theEvent.returnValue = false;
        theEvent.preventDefault();
      }
    });
  },
}
