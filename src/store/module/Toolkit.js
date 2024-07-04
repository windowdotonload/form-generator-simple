export default {
  namespaced: true,
  state: () => ({
    toolkitBreadcrumb: [
      {
        toolName: "计算工具",
        toolCode: "toolkitIndex"
      }
    ],
    toolkitCurrentComponent: "toolkitIndex"
  }),
  mutations: {
    flashBackState(state) {
      state.toolkitBreadcrumb = [
        {
          toolName: "计算工具",
          toolCode: "toolkitIndex"
        }
      ];
      state.toolkitCurrentComponent = "toolkitIndex";
    },
    toolkitBreadcrumbBack(state) {
      state.toolkitBreadcrumb.splice(1);
      this.commit("Toolkit/changeToolkitBreadcrumb", state.toolkitBreadcrumb[0]);
    },
    changeToolkitCurrentComponent(state, toolCode) {
      if (toolCode == state.toolkitCurrentComponent) return;
      state.toolkitCurrentComponent = toolCode;
    },
    changeToolkitBreadcrumb(state, toolItem) {
      const { toolCode, toolName, configuration } = toolItem;
      if (configuration) {
        sessionStorage.setItem(`toolkit-${toolCode}`, configuration);
      }
      if (toolCode != "toolkitIndex" && state.toolkitBreadcrumb.map(item => item.toolCode).includes(toolCode)) return;
      if (toolCode == "toolkitIndex") {
        state.toolkitBreadcrumb = [
          {
            toolName: "计算工具",
            toolCode: "toolkitIndex"
          }
        ];
      } else {
        state.toolkitBreadcrumb.push({
          toolCode,
          toolName
        });
      }
      this.commit("Toolkit/changeToolkitCurrentComponent", toolCode);
      Vue.prototype.$gio.toCalculateToolSecondaryPage({
        toolName
      });
    }
  }
};
