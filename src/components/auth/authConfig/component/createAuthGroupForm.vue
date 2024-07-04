<template>
  <el-form :model="groupFrom" label-width="100px" ref="groupRef">
    <el-form-item prop="authGroupName" :rules="[{ required: true, message: '请输入权限组名称', trigger: 'blur' }]" label="权限组名称" label-position="right">
      <el-input v-model="groupFrom.authGroupName" @input="changeValue" size="mini" type="text" maxlength="20" show-word-limit style="width:70%" />
    </el-form-item>
    <el-form-item style="margin-bottom:0;display: flex;justify-content: flex-end;">
      <el-button size="mini" @click="deleteAuthGroup" type="danger" plain v-if="edit">删除</el-button>
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="danger" size="mini" @click="confrim">确认</el-button>
    </el-form-item>

    <el-dialog title="删除" :visible.sync="dialogVisible" width="26%" append-to-body class="auth__create-group-form">
      <span>请确认是否删除权限组？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
        <el-button type="danger" @click="confirmDeleteAuthGroup" size="mini" plain>确 定</el-button>
      </span>
    </el-dialog>
  </el-form>
</template>

<script>
import { state, useAuthGroupConfig } from "../auth";
import * as AUTHAPI from "../authApi";
export default {
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    editItem: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      dialogVisible: false,
      groupFrom: {
        authGroupName: ""
      }
    };
  },
  created() {
    this.revertEditItemInfo();
  },

  methods: {
    revertEditItemInfo() {
      if (!this.edit) return;
      this.groupFrom.authGroupName = this.editItem.name;
    },
    clearValue() {
      this.$refs.groupRef.clearValidate();
      this.groupFrom.authGroupName = "";
      this.$destroy();
    },
    cancel() {
      this.clearValue();
      ELEMENT.MessageBox.close();
    },
    deleteAuthGroup() {
      this.dialogVisible = true;
    },
    async confirmDeleteAuthGroup() {
      try {
        Vue.prototype.FULLSCREENLOADING("正在删除权限组...");
        await useAuthGroupConfig().deleteAuthGroup(this.editItem);
      } finally {
        ELEMENT.MessageBox.close();
        this.dialogVisible = false;
        this.clearValue();
        Vue.prototype.FULLSCREENENDLOADING();
      }
    },
    confrim() {
      if (!this.groupFrom.authGroupName)
        return ELEMENT.Message({
          type: "warning",
          message: "请输入权限组名称"
        });
      let cacheValue = this.groupFrom.authGroupName;
      if (this.edit) {
        cacheValue = {
          ...this.editItem,
          name: this.groupFrom.authGroupName
        };
      }
      try {
        this.$emit("confirmCb", cacheValue);
      } finally {
        this.clearValue();
      }
    }
  }
};
</script>

<style>
.auth__create-group-form .el-dialog__body {
  padding: 0 20px;
}
</style>
