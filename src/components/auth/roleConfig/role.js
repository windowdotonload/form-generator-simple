import * as ROLEAPI from "./roleApi";
const { ref, reactive } = VueCompositionAPI;
/**
 * @typedef {Object} authGroupItem
 * @property {string} key
 * @property {string} value
 */
const activeRoleItemKey = ref("");
export const state = reactive({
  roleContainerLoading: false,
  activeRoleItemKey,
  activeRoleItem: null,
  roleList: []
});

export const useRoleConfig = () => {
  const switchLoading = loading => {
    state.roleContainerLoading = loading;
  };

  const clearState = () => {
    activeRoleItemKey.value = "";
    state.activeRoleItem = null;
    state.roleList = [];
  };

  const getRoleList = async () => {
    switchLoading(true);
    const res = await ROLEAPI.role_getList();
    switchLoading(false);
    if (res) {
      res.data.data.forEach(item => {
        item.id = item.accessTemplateId;
      });
      state.roleList = res.data.data || [];
      if (!state.activeRoleItem && state.roleList.length) swithActiveRoleItem(state.roleList[0]);
      return;
    }
    return (state.roleList = []);
  };

  const refreshRoleList = async () => {
    state.roleList = [];
    await getRoleList();
    if (state.activeRoleItem) {
      swithActiveRoleItem(state.roleList.find(item => item.id === state.activeRoleItem.id));
    }
  };

  const getActiveKey = () => {
    return activeRoleItemKey;
  };

  const swithActiveRoleItem = item => {
    state.activeRoleItem = item;
    activeRoleItemKey.value = item.key;
  };

  return {
    clearState,
    getRoleList,
    getActiveKey,
    refreshRoleList,
    swithActiveRoleItem
  };
};
