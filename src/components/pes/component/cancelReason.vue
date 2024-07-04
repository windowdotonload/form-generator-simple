<template>
    <div class="form-container selected-table-filter">
        <el-form :model="addPlanForm" :rules="addPlanRules" ref="cancelReasonForm" class="demo-ruleForm" label-width="100px" label-position="top">
            <el-form-item  prop="reason" label="原因">
                <el-input type="textarea"  :rows="15" resize="none" show-word-limit v-model="addPlanForm.reason"  style="width: 100%" size="small" placeholder="请输入" clearable maxlength="200"></el-input>
            </el-form-item>
            
        </el-form>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      selectedData: {
        type: Array,
        default: null
      },
      overViewData: {
        type: Object,
        default: {}
      },
    },
    data() {
      return {
        selectedDataExpand: true,
        addPlanForm:{  // 计划目标 表单
            reason:''
        },
        addPlanRules: {
            reason: [{ required: true, message: "请输入取消原因", trigger: "blur" }]
        },
      };
    },
    created() {
    },
    methods: {
      
    }
  };
  </script>
  
  <style lang="less" scoped>
  .form-container {
    height: fit-content;
    position: relative;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .module-title {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  .table-selected-container {
    position: relative;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    transition: all 0.5s ease;
  }
  .table-selected-data-box {
    width: 95%;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    height: fit-content;
    box-sizing: border-box;
    transition: all 0.5s ease;
  }
  .table-selected-more-btn {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-left: 10px;
    padding-right: 10px;
    cursor: pointer;
  }
  .table-selected-item {
    margin-left: 15px;
    display: inline-block;
    height: 23px;
    font-size: 13px;
    color: #666;
    width: 100%;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .selected-table-filter {
    border-radius: 8px;
    background: #f9f9f9;
  }
  </style>
  