<template>
  <div class="auth-config-panel__container" v-loading="authPanelLoading">
    <PanelMenu :menuList="list" :activeAuthItem="activeAuthItem" @clickMenuItem="clickMenuItem" @sortMenuList="sortMenuList" />
    <PanelContent :key="activeAuthItem" :activeAuthItem="activeAuthItem" @changeAuthName="changeAuthName" @saveAuthItem="saveAuthItem" @deleteAuthItem="deleteAuthItem" />
  </div>
</template>

<script>
import { state, useAuthGroupConfig, EVENT_BUS } from "../auth";
import * as AUTHAPI from "../authApi";
export default {
  components: {
    PanelMenu: () => import("./authConfigPanelMenu"),
    PanelContent: () => import("./authConfigPanelContent")
  },
  created() {
    this.registerEvent();
    this.getAuthList();
  },
  setup() {
    return {
      state
    };
  },
  data() {
    return {
      list: [],
      authPanelLoading: false,
      activeAuthItem: null
    };
  },
  methods: {
    registerEvent() {
      EVENT_BUS.$on("refreshList", () => {
        this.list = [];
        this.activeAuthItem = null;
        this.getAuthList();
      });
      EVENT_BUS.$on("getAuthGroup", () => {
        this.getAuthList();
      });
      EVENT_BUS.$on("saveListSort", () => {
        this.saveListSort();
      });
    },
    findRawActiveItem() {
      if (!this.activeAuthItem) return;
      this.activeAuthItem = this.list.find(item => item.id === this.activeAuthItem.id);
    },
    sortMenuList(newList) {
      this.list = JSON.parse(JSON.stringify(newList));
      this.findRawActiveItem();
    },
    clearAuthItem() {
      this.activeAuthItem = null;
    },
    clickMenuItem(item) {
      this.activeAuthItem = item;
      this.state.activeName = "weChat";
    },
    changeAuthName(val) {
      this.activeAuthItem.name = val;
    },
    deleteListItem(deleteId) {
      this.list.splice(this.list.findIndex(item => item.id === deleteId), 1);
    },
    async getAuthList() {
      this.authPanelLoading = true;
      const authListRes = await AUTHAPI.group_listOfLevel({ level: 2, id: state.activeAuthGroupItem.id });
      this.list = authListRes.data.data || [];
      if (!this.activeAuthItem && this.list.length) {
        this.activeAuthItem = this.list[0];
      } else {
        this.activeAuthItem = this.list.find(item => item.id === this.activeAuthItem.id);
      }
      this.authPanelLoading = false;
    },
    async saveListSort() {
      const handleSortArr = this.list.map((item, index) => {
        return {
          groupId: item.id,
          sort: index + 1
        };
      });
      await AUTHAPI.group_batchUpdateSort(handleSortArr);
    },
    async saveAuthItem(data) {
      const { permissionGroupMenuRels, oldPermissionGroupMenuRels, menuGroupRule } = data;
      const params = {
        groupId: this.activeAuthItem.id,
        groupName: this.activeAuthItem.name,
        newPermissionGroupMenuRels: permissionGroupMenuRels,
        oldPermissionGroupMenuRels,
        menuGroupRule
      };
      const res = await AUTHAPI.group_updatePermissionGroupMenuRel(params);
      await this.saveListSort();
      if (res) {
        ELEMENT.Message({
          type: "success",
          message: "修改权限成功"
        });
        await this.getAuthList();
        if (data.__cb) data.__cb();
      }
    },
    deleteAuthItem() {
      ELEMENT.MessageBox.confirm("请确认是否删除权限？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            await this.saveListSort();
            this.authPanelLoading = true;
            const res = await AUTHAPI.group_delete({ id: this.activeAuthItem.id });
            if (res) {
              this.deleteListItem(this.activeAuthItem.id);
              this.clearAuthItem();
              ELEMENT.Message({
                type: "success",
                message: "删除权限成功"
              });
            }
          } finally {
            this.authPanelLoading = false;
          }
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="less" scoped>
.auth-config-panel__container {
  display: flex;
  flex-wrap: nowrap;
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
