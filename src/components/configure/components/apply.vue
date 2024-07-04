<template>
  <div>
    <el-dialog class="closeWorkOrder"  :visible.sync="dialogFlag" title="创建申请单" top="100px" :show-close="false" width="32%" >
        <el-form :model="questionForm" :rules="serviceTypeRule" ref="questionForm" label-position="top"  >
          <el-form-item
            label="客户"
            prop="customerId"
          >
            <el-select
              class="dialog"
              size="small"
              clearable
              v-model="questionForm.customerId"
              style="width:100%;background: #F9F9F9;"
            >
              <el-option
                v-for="item in companyList"
                :key="item.customerId"
                :label="item.companyName"
                :value="item.customerId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="润滑点设备类型"
            prop="lubricationPointTypeCode"
          >
            <el-select 
              v-model="questionForm.lubricationPointTypeCode" 
              placeholder="请选择"
              class="dialog"
              clearable
              style="width:100%;background: #F9F9F9;"
              size="small">
                <el-option
                  v-for="item in lubricationPointTypeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                  >
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item
            label="油品种类"
            prop="description"
          >
            <el-select
                size="small"
                style="width:100%;background: #F9F9F9;"
                clearable
                class="dialog"
                v-model="questionForm.oilNumber"
              >
                <el-option
                  v-for="item in oilData"
                  :key="item.oilNumber"
                  :label="item.oilName"
                  :value="item.oilNumber"
                ></el-option>
            </el-select>
          </el-form-item>
          <div style="margin-bottom:20px;font-size: 16px;"><span style="color:#dd0000">*</span>请选择您遇到的问题</div>
          <div style="max-height:640px;overflow:auto">
            <el-collapse v-model="selectQuestionList" @change="handleChange">
              <el-collapse-item v-for="item in questionList" :key="item" :name="item.id">
                <template slot="title">
                  {{item.name}}
                </template>
                  <el-checkbox-group v-model="checkList"> 
                    <el-checkbox :label="res.id" v-for="res in item.children" :key="res.id">{{res.name}}</el-checkbox>
                  </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
            <div style="background:#F9F9F9;padding:20px;border: 1px solid #E4E7ED;" v-if="checkList.includes(2)">
              <el-form-item
                label="详细描述"
                prop="description"
              >
                <el-input  
                placeholder="请填写具体的现象，100字以内。" 
                size="small" 
                type="textarea" 
                resize='none' 
                style="width:100%"
                :row="4" 
                v-model="questionForm.description" 
                maxlength="100" 
                show-word-limit>
                </el-input>
              </el-form-item>
            </div>

          </div>

      </el-form>
        <div slot="footer" style="margin-top:-20px;">
          <el-button type="danger" plain @click="handleResetAdd('questionForm')" size="small">取消</el-button>
          <el-button type="danger" @click="sureAddWorkOrder('questionForm')" size="small">确定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props:{
    dialogFlag:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    lubricationPointTypeList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    selectQuestionList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    questionList:{
      type:Array,
      default:()=>{
        return []
      }
    },
    oilData:{
      type:Array,
      default:()=>{
        return []
      }
    },
    questionForm:{
      type:Object,
      default:()=>{
        return {}
      }
    },
  },
  data(){
    return{
      checkList: [], //选中的问题
      companyList:[],
       //   表单验证规则
      serviceTypeRule: {
        companyNumber: [
          { required: true, message: "请选择客户", trigger: "change" }
        ],
        lubricationPointTypeCode: [
          { required: true, message: "请选择润滑点设备类型", trigger: "change" }
        ],
        description: [
          { required: true, message: "请输入详细描述", trigger: "change" }
        ]
      },
    }
  },
  created() {
    console.log(this.questionForm,9999,this.dialogFlag,this.lubricationPointTypeList)
    this.getCompanyData()
  },
  methods:{
    getCompanyData() {
      let param = {
        companyName:''
      }
      this.requestMethodGet("/weChat/workshop/getWorkshopCustomerList", param)
        .then(res => {
          this.loading = false;
          res = res.data;
          if (res.code == 1000) {
            this.companyList=res.data.list
          } else {
            this.$message({
              message: res.msg,
              type: "warning"
            });
          }
        })
        .catch(res => {});
    },
    handleResetAdd (formName) {
      this.dialogFlag = false
      this.$refs[formName].resetFields();
    },
    // 确定新建申请单
    sureAddWorkOrder() {
      console.log(this.questionForm)
      this.$emit('sureAddOrder',this.questionForm)
    },
  }
}
</script>
<style scoped lang="less">
  /deep/ .el-dialog__body{
    padding: 40px;
  }
  /deep/ .dialog .el-input--small .el-input__inner {
    height: 48px  !important;
    line-height: 48px  !important;
    background: #f9f9f9   !important;
}
.el-dialog__headerbtn {
  top:13px;
  right:12px;
}
.el-dialog__body {
      padding:10px 20px 20px 40px;
    }
</style>