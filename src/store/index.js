import Vue from "vue";
import Vuex from "vuex";
import parametricReportModule from "./module/ParametricReport";
import Toolkit from "./module/Toolkit";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    parametricReportModule,
    Toolkit
  },
  state: {
    userHelpState: "Search", // 'Search' | 'Content'
    userHelpCateName: "工单管理",
    userHelpItemName: "如何创建工单",
    userHelpLeftActiveItem: null,
    userHelpDisplayActiveItem: null,
    userHelpDisplayContentItem: null,
    userHelpSearchFormRecord: null
  },
  mutations: {
    changeUserHelpState(state, type) {
      state.userHelpState = type;
    },
    changeUserHelpCateName(state, name) {
      state.userHelpCateName = name;
    },
    changeUserHelpItemName(state, name) {
      state.userHelpItemName = name;
    },
    changeUserHelpLeftActiveItem(state, item) {
      state.userHelpLeftActiveItem = item;
    },
    changeUserHelpDisplayActiveItem(state, item) {
      state.userHelpDisplayActiveItem = item;
    },
    changeUserHelpDisplayContentItem(state, item) {
      state.userHelpDisplayContentItem = item;
    },
    changeUserHelpSearchFormRecord(state, item) {
      state.userHelpSearchFormRecord = item;
    }
  }
});
