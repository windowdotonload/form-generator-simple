<template>
  <div style="width: 100%" class="group-container">
    <el-form ref="createForm" :model="createForm" :rules="rules">
      <el-form-item label="客户组名" prop="groupName">
        <el-input maxlength="15" v-model="createForm.groupName" size="small" style="width: 80%"></el-input>
      </el-form-item>
    </el-form>
    <div style="display: flex; justify-content: flex-end; padding-right: 3%">
      <el-button size="small" plain @click="cancel">取消</el-button>
      <el-button size="small" type="danger" @click="nextStep">下一步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['modelStateOb'],
  data () {
    return {
      createForm: {
        groupName: ''
      },
      rules: {
        groupName: [{ required: true, message: '请输入客户组名', trigger: 'blur' }]
      }
    }
  },
  created () {
    if (this.modelStateOb.recordData.groupName) this.createForm.groupName = this.modelStateOb.recordData.groupName
  },
  methods: {
    cancel () {
      this.modelStateOb.dialogVisible = false
    },
    nextStep () {
      this.$refs.createForm.validate((valid) => {
        if (valid) {
          this.modelStateOb.recordData.groupName = this.createForm.groupName
          this.modelStateOb.title = '客户'
          this.modelStateOb.currentStep = 1
          this.modelStateOb.modelBoxWidth = '60%'
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.group-container {
  /deep/ .el-form-item {
    width: 100%;
  }
  /deep/ .el-form-item__error {
    margin-left: 80px;
  }
}
</style>
