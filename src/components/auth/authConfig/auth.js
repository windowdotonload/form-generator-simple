import * as AUTHAPI from "./authApi";
const { ref, reactive } = VueCompositionAPI;
/**
 * @typedef {Object} authGroupItem
 * @property {string} id
 * @property {string} level
 * @property {string} name
 */

export const EVENT_BUS = new Vue();

const activeAuthGroupItemKey = ref("");
export const state = reactive({
  loadingLayout: false,
  authGroupList: [],
  activeAuthGroupItemKey,
  activeAuthGroupItem: null,
  permissionGroupMenuRels: null
});

export const useAuthGroupConfig = () => {
  const swithActiveAuthGroupItem = item => {
    if (state.activeAuthGroupItem && state.activeAuthGroupItem.id == item.id) return;
    state.activeAuthGroupItem = item;
    activeAuthGroupItemKey.value = item.id;
    EVENT_BUS.$emit("refreshList");
  };
  const swithActiveAuthGroupItemDirect = item => {
    state.activeAuthGroupItem = item;
    activeAuthGroupItemKey.value = item.id;
    EVENT_BUS.$emit("refreshList");
  };

  const getAuthGroup = async () => {
    state.loadingLayout = true;
    try {
      const res = await AUTHAPI.group_listOfLevel({ level: 1 });
      if (res) {
        state.authGroupList = res.data.data || [];
        if (!state.authGroupList.length) return;
        if (state.activeAuthGroupItem) {
          swithActiveAuthGroupItemDirect(state.authGroupList.find(item => item.id === state.activeAuthGroupItem.id));
        } else {
          swithActiveAuthGroupItem(state.authGroupList[0]);
        }
        return (state.loadingLayout = false);
      }
      state.loadingLayout = false;
      return [];
    } finally {
      state.loadingLayout = false;
    }
  };

  const getActiveKey = () => {
    return activeAuthGroupItemKey;
  };

  /**
   * @param {authGroupItem[]} authGroupItem
   */
  const setAuthGroup = authGroupItem => {
    state.authGroupList = authGroupItem;
  };

  /**
   * @param {authGroupItem} authGroupItem
   */
  const addAuthGroup = authGroupItem => {
    state.authGroupList.push(authGroupItem);
  };

  const clearActiveAuthGroupItem = () => {
    state.activeAuthGroupItem = null;
    state.activeAuthGroupItemKey = "";
  };
  /**
   * @param {authGroupItem} authGroupItem
   */
  const deleteAuthGroup = async authGroupItem => {
    const deleteRes = await AUTHAPI.group_delete({ id: authGroupItem.id });
    if (deleteRes && deleteRes.data.code == 1000) {
      ELEMENT.Message({
        type: "success",
        message: "删除权限组成功"
      });
      clearActiveAuthGroupItem();
      ELEMENT.MessageBox.close();
      useAuthGroupConfig().getAuthGroup();
    }
  };

  return {
    setAuthGroup,
    getAuthGroup,
    getActiveKey,
    addAuthGroup,
    deleteAuthGroup,
    swithActiveAuthGroupItem
  };
};
