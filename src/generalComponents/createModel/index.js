export const extendComponents = {
  components: {}
};
let vmRecord = { el: null, vm: null };
/**
 *
 * @param {
 *  title:String
 *  modelStateOb:Record<string,Observable>
 *  components:Record<string,Vnode>
 *  allSteps:Number
 *  currentStep:Number
 * } state
 *
 */
const createModel = state => {
  const { components } = state;
  const StepsComponents = Object.keys(components).map(item => item);
  extendComponents.components = { ...components };

  const vm = new Vue({
    provide: {
      modelStateOb: state.modelStateOb
    },
    render: h =>
      h(require("./containerTemplate.vue").default, {
        props: {
          vmRecord,
          topLevelState: state.modelStateOb,
          title: state.title,
          StepsComponents
        }
      })
  });
  const el = vm.$mount();
  vmRecord.el = el.$el;
  vmRecord.vm = vm;
  document.body.appendChild(el.$el);
};

export default createModel;
