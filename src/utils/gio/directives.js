Vue.directive(
  "gio",
  (() => {
    let handleFunc = null;
    return {
      bind(el, binding, vnode) {
        const { arg = "Track", expression, modifiers } = binding;
        Object.keys(modifiers).forEach(eventName => {
          handleFunc = () => {
            Vue.prototype.$gio[arg](expression);
          };
          el.addEventListener(eventName, handleFunc);
        });
      },
      unbind(el, binding, vnode) {
        const { modifiers } = binding;
        Object.keys(modifiers).forEach(eventName => {
          el.removeEventListener(eventName, handleFunc);
        });
      }
    };
  })()
);
