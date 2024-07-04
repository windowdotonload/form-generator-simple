const __$vm = new Vue();

export const messageBoxFunc = (component, title, confirmCb, componentProps) => {
  const h = __$vm.$createElement;
  ELEMENT.MessageBox({
    title,
    message: h(Vue.extend(Object.assign({}, component)), {
      props: {
        ...componentProps
      },
      on: {
        confirmCb
      }
    }),
    showClose: false,
    closeOnClickModal: false,
    showCancelButton: false,
    showConfirmButton: false,
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    confirmButtonClass: "el-button--confirm-msdp"
  }).catch(() => {});
};
