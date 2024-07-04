<template>
  <el-button size="mini" @click="deleteRole">删除角色</el-button>
</template>

<script>
import * as ROLEAPI from "../roleApi";
import { state, useRoleConfig } from "../role.js";
export default {
  methods: {
    deleteRole() {
      this.$confirm("确认删除该角色？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const res = await ROLEAPI.role_delete({
          accessTemplateId: state.activeRoleItem.accessTemplateId
        });
        if (res.data.code == 1000) {
          useRoleConfig().clearState();
          useRoleConfig().getRoleList();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped></style>
