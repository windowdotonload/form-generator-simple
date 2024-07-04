<template>
  <el-button size="mini" type="danger" @click="createAuthGroup">新建权限组</el-button>
</template>

<script>
import { messageBoxFunc } from "../../utils";
import { useAuthGroupConfig } from "../auth.js";
import * as AUTHAPI from "../authApi";
import createAuthGroupForm from "./createAuthGroupForm";
const AUTH = useAuthGroupConfig();
export default {
  methods: {
    createAuthGroup() {
      messageBoxFunc(createAuthGroupForm, "新建权限组", async cacheValue => {
        const res = await AUTHAPI.group_add({ name: cacheValue, level: 1 });
        if (res.data.code == 1000) {
          ELEMENT.Message({
            type: "success",
            message: "新建权限组成功"
          });
          AUTH.getAuthGroup();
        }
        ELEMENT.MessageBox.close();
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
