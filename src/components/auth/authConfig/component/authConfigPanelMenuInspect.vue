<template>
  <div class="panel-menu-inpect__container">
    <div class="panel-menu-inpect__top">
      <span class="panel-menu-inpect__auth-name"><TooltipTextItem :text="`权限组：${state.activeAuthGroupItem.name}`"/></span>
      <el-button type="text" size="mini" style="color:#d10000" @click="configAuthGroup">配置权限组</el-button>
    </div>
    <el-button type="danger" plain style="width: 100%;padding: 8px;" @click="createAuth">新增</el-button>
  </div>
</template>

<script>
import { messageBoxFunc } from "../../utils";
import createAuthForm from "./createAuthForm";
import createAuthGroupForm from "./createAuthGroupForm";
import { state, useAuthGroupConfig } from "../auth";
import * as AUTHAPI from "../authApi";
export default {
  setup() {
    return {
      state
    };
  },
  components: {
    TooltipTextItem: () => import("../../component/menuListItem")
  },
  methods: {
    createAuth() {
      messageBoxFunc(createAuthForm, "新建权限");
    },
    configAuthGroup() {
      messageBoxFunc(
        createAuthGroupForm,
        "配置权限组",
        async (cacheValue, opType) => {
          const res = await AUTHAPI.group_update({ ...cacheValue });
          if (res.data.code == 1000) {
            ELEMENT.Message({
              type: "success",
              message: "配置权限组成功"
            });
            useAuthGroupConfig().getAuthGroup();
          }
          ELEMENT.MessageBox.close();
        },
        {
          edit: true,
          editItem: state.activeAuthGroupItem
        }
      );
    }
  }
};
</script>

<style lang="less" scoped>
.panel-menu-inpect__container {
  display: flex;
  flex-wrap: wrap;
  align-content: space-between;
  position: relative;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  height: 95px;
  border-bottom: 1px solid #e9e9e9;
  overflow: hidden;
}
.panel-menu-inpect__top {
  width: 100%;
  height: 30px;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  align-items: center;
}
.panel-menu-inpect__auth-name {
  display: inline-block;
  width: 50%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--icon-text-1000000, #000);
  font-family: Microsoft YaHei;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
}
.list-group {
  box-sizing: border-box;
  width: 100%;
  height: 100%;
}
</style>
