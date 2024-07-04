export default {
  namespaced: true,
  state: () => ({
    record: {}
  }),
  mutations: {
    createRecordImte(state, createIitem) {
      state.record[createIitem.key] = createIitem.val;
    }
  }
};
