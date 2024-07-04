<template>
  <el-form :model="authForm" label-width="80px" ref="authRef">
    <el-form-item prop="authName" label="权限名称" label-position="right" :rules="[{ required: true, message: '请输入权限名称', trigger: 'blur' }]">
      <el-input v-model="authForm.authName" size="mini" type="text" maxlength="20" show-word-limit style="width:70%" />
    </el-form-item>
    <el-form-item style="margin-bottom:0;display: flex;justify-content: flex-end;">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="danger" size="mini" @click="confrim">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import * as AUTHAPI from "../authApi";
import { state, useAuthGroupConfig, EVENT_BUS } from "../auth";
export default {
  data() {
    return {
      authForm: {
        authName: ""
      }
    };
  },
  beforeDestroy() {
    this.clearValue();
  },
  methods: {
    clearValue() {
      this.authName = "";
    },
    cancel() {
      this.$refs.authRef.clearValidate();
      this.authForm.authName = "";
      ELEMENT.MessageBox.close();
      this.$destroy();
    },
    async confrim() {
      if (!this.authForm.authName)
        return ELEMENT.Message({
          type: "warning",
          message: "请输入权限名称"
        });
      await EVENT_BUS.$emit("saveListSort");
      const res = await AUTHAPI.group_add({ name: this.authForm.authName, level: 2, parentId: state.activeAuthGroupItem.id });
      if (res && res.data.code == 1000) {
        ELEMENT.Message({
          type: "success",
          message: "新增权限成功"
        });
        EVENT_BUS.$emit("getAuthGroup");
      }
      ELEMENT.MessageBox.close();
      this.$destroy();
    }
  }
};
</script>
