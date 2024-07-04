<template>
  <el-form ref="roleForm" :model="roleForm" label-width="110px">
    <el-form-item prop="authGroupName" label="角色名称" label-position="right" :rules="[{ required: true, message: '请输入权限名称', trigger: 'blur' }]">
      <el-input v-model="roleForm.authGroupName" @input="changeValue" size="mini" type="text" maxlength="20" show-word-limit style="width:70%" />
    </el-form-item>
    <el-form-item prop="ownerType" label="角色归属" :rules="[{ required: true, message: '请选择角色归属', trigger: 'blur' }]">
      <el-radio-group v-model="roleForm.ownerType">
        <el-radio :label="0">美孚</el-radio>
        <el-radio :label="1">经销商</el-radio>
        <!-- <el-radio :label="2">客户</el-radio> -->
      </el-radio-group>
    </el-form-item>
    <el-form-item prop="dutyType" label="职责类型" :rules="[{ required: true, message: '请选择职责类型', trigger: 'blur' }]" v-if="roleForm.ownerType == 0">
      <el-radio-group v-model="roleForm.dutyType">
        <el-radio :label="1">管理类</el-radio>
        <el-radio :label="2">执行类</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item style="margin-bottom:0;display: flex;justify-content: flex-end;">
      <el-button size="mini" @click="cancel">取消</el-button>
      <el-button type="danger" size="mini" @click="confrim">确认</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import * as ROLEAPI from "../roleApi";
import { state, useRoleConfig } from "../role.js";
export default {
  data() {
    return {
      roleForm: {
        authGroupName: "",
        ownerType: 0,
        dutyType: ""
      }
    };
  },
  beforeDestroy() {
    this.clearValue();
  },
  methods: {
    clearValue() {
      this.roleForm.authGroupName = "";
    },
    cancel() {
      this.clearValue();
      ELEMENT.MessageBox.close();
    },
    async confrim() {
      this.$refs.roleForm.validate(async valid => {
        if (!valid) return;
        const roleCreateRes = await ROLEAPI.role_add({
          accessTemplate: {
            accessTemplateName: this.roleForm.authGroupName,
            ownerType: this.roleForm.ownerType,
            dutyType: this.roleForm.dutyType
          },
          addSecondGroupIds: [],
          deleteSecondGroupIds: []
        });
        if (roleCreateRes && roleCreateRes.data.code == 1000) {
          this.$message.success("新建角色成功");
          this.cancel();
          useRoleConfig().getRoleList();
        }
      });
    }
  }
};
</script>
