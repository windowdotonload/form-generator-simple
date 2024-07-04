<template>
  <el-button size="mini" type="danger" @click="createAuthGroup">新建角色</el-button>
</template>

<script>
import { messageBoxFunc } from "../../utils";
import { useRoleConfig } from "../role.js";
import createRole from "./createRole";
export default {
  methods: {
    createAuthGroup() {
      messageBoxFunc(createRole, "新建角色");
    }
  }
};
</script>

<style lang="less" scoped></style>
